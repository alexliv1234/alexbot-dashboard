#!/usr/bin/env python3
"""
Sync playing group data to dashboard JSON
Reads from:
- memory/channels/playing-with-alexbot-scores.json
- memory/channels/playing-with-alexbot-suggestions.json
- memory/bot-registry.json
- memory/channels/playing-with-alexbot-winners.json
- memory/channels/playing-with-alexbot-daily/*.jsonl
- memory/channels/playing-with-alexbot-per-sender/*/conversation.jsonl
- memory/bot-conversations/*/conversation.jsonl
"""
import json
import os
from pathlib import Path
from datetime import datetime
import glob

WORKSPACE = Path(__file__).parent.parent.parent
DATA_OUT = WORKSPACE / "alexbot-dashboard/data/playing-group.json"

def load_json(path):
    """Load JSON file, return empty dict if not found"""
    try:
        with open(path) as f:
            return json.load(f)
    except:
        return {}

def load_jsonl(path):
    """Load JSONL file, return list of entries"""
    try:
        with open(path) as f:
            return [json.loads(line) for line in f if line.strip()]
    except:
        return []

def normalize_phone(phone):
    """Normalize phone to +972XXXXXXXXX format"""
    phone = str(phone).strip()
    phone = ''.join(c for c in phone if c.isdigit() or c == '+')
    if phone.startswith('972') and not phone.startswith('+'):
        phone = '+' + phone
    return phone

def build_people_scores():
    """Build people leaderboard from scores.json + daily logs + winners"""
    scores_path = WORKSPACE / "memory/channels/playing-with-alexbot-scores.json"
    scores_data = load_json(scores_path)
    scores = scores_data.get('scores', {})
    
    # Also aggregate from daily logs
    daily_dir = WORKSPACE / "memory/channels/playing-with-alexbot-daily"
    all_messages = []
    
    if daily_dir.exists():
        for jsonl_file in sorted(daily_dir.glob("*.jsonl")):
            all_messages.extend(load_jsonl(jsonl_file))
    
    # Build leaderboard
    people = {}
    for jid, data in scores.items():
        norm_jid = normalize_phone(jid)
        if norm_jid not in people:
            people[norm_jid] = {
                'jid': norm_jid,
                'name': data.get('name', 'Unknown'),
                'totalScore': data.get('total', 0),
                'messages': data.get('count', 0),
                'avgScore': data.get('average', 0),
                'creativity': data.get('scores', {}).get('creativity', 0),
                'challenge': data.get('scores', {}).get('challenge', 0),
                'humor': data.get('scores', {}).get('humor', 0),
                'cleverness': data.get('scores', {}).get('cleverness', 0),
                'engagement': data.get('scores', {}).get('engagement', 0),
                'broke': data.get('scores', {}).get('broke', 0),
                'hacked': data.get('scores', {}).get('hacked', 0),
            }
    
    # Sort by total score descending
    leaderboard = sorted(people.values(), key=lambda x: x['totalScore'], reverse=True)
    return leaderboard

def build_bot_scores():
    """Build bot leaderboard from bot-registry.json + bot conversations"""
    registry_path = WORKSPACE / "memory/bot-registry.json"
    registry = load_json(registry_path)
    
    bots = []
    for bot in registry.get('bots', []):
        bot_data = {
            'name': bot.get('name'),
            'handle': bot.get('handle'),
            'phone': bot.get('phone'),
            'trustScore': bot.get('trustScore', 0),
            'trustLevel': bot.get('trustLevel', 'new'),
            'owner': bot.get('owner', {}).get('name', 'Unknown'),
            'description': bot.get('description', ''),
            'status': bot.get('status', 'pending'),
            'approvedAt': bot.get('approvedAt'),
            'messagesSent': bot.get('stats', {}).get('messagesSent', 0),
            'messagesReceived': bot.get('stats', {}).get('messagesReceived', 0),
        }
        bots.append(bot_data)
    
    # Sort by trust score descending
    return sorted(bots, key=lambda x: x['trustScore'], reverse=True)

def build_suggestions():
    """Build suggestions list from suggestions.json"""
    sugg_path = WORKSPACE / "memory/channels/playing-with-alexbot-suggestions.json"
    sugg_data = load_json(sugg_path)
    
    suggestions = []
    for sugg in sugg_data.get('suggestions', []):
        suggestions.append({
            'id': sugg.get('id'),
            'timestamp': sugg.get('timestamp'),
            'suggestedBy': sugg.get('suggestedBy', {}).get('name', 'Unknown'),
            'type': sugg.get('type'),
            'description': sugg.get('description'),
            'total': sugg.get('total', 0),
            'status': sugg.get('status', 'pending'),
            'notes': sugg.get('notes', ''),
            'implementedAt': sugg.get('implementedAt'),
            'scores': sugg.get('scores', {}),
        })
    
    # Sort by timestamp descending
    return sorted(suggestions, key=lambda x: x.get('timestamp', ''), reverse=True)

def build_daily_summaries():
    """Build daily summaries from winners.json"""
    winners_path = WORKSPACE / "memory/channels/playing-with-alexbot-winners.json"
    winners_data = load_json(winners_path)
    
    summaries = []
    for date, day_data in winners_data.get('winners', {}).items():
        summary = {
            'date': date,
            'first': day_data.get('first', {}),
            'second': day_data.get('second', {}),
            'third': day_data.get('third', {}),
        }
        summaries.append(summary)
    
    # Sort by date descending
    return sorted(summaries, key=lambda x: x['date'], reverse=True)

def build_conversations():
    """Build conversation logs from per-sender directories"""
    per_sender_dir = WORKSPACE / "memory/channels/playing-with-alexbot-per-sender"
    
    conversations = []
    if per_sender_dir.exists():
        for sender_dir in per_sender_dir.iterdir():
            if sender_dir.is_dir():
                conv_file = sender_dir / "conversation.jsonl"
                if conv_file.exists():
                    messages = load_jsonl(conv_file)
                    if messages:
                        # Get latest message for preview
                        latest = messages[-1] if messages else {}
                        conversations.append({
                            'phone': sender_dir.name,
                            'name': latest.get('sender_name', 'Unknown'),
                            'messageCount': len(messages),
                            'lastMessage': latest.get('timestamp'),
                            'preview': latest.get('message', '')[:100] if latest.get('message') else '',
                        })
    
    # Sort by last message descending
    return sorted(conversations, key=lambda x: x.get('lastMessage') or '', reverse=True)

def main():
    print("🔄 Syncing playing group data...")
    
    data = {
        'timestamp': datetime.now().isoformat() + 'Z',
        'peopleScores': build_people_scores(),
        'botScores': build_bot_scores(),
        'suggestions': build_suggestions(),
        'dailySummaries': build_daily_summaries(),
        'conversations': build_conversations(),
    }
    
    print(f"  👥 People: {len(data['peopleScores'])}")
    print(f"  🤖 Bots: {len(data['botScores'])}")
    print(f"  💡 Suggestions: {len(data['suggestions'])}")
    print(f"  📅 Daily summaries: {len(data['dailySummaries'])}")
    print(f"  💬 Conversations: {len(data['conversations'])}")
    
    # Write to output
    DATA_OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(DATA_OUT, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Saved to {DATA_OUT}")

if __name__ == '__main__':
    main()
