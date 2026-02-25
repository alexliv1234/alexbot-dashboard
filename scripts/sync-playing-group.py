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
    """Build ALL-TIME people leaderboard from daily logs + scores.json + winners"""
    
    # Start with current scores (today's data)
    scores_path = WORKSPACE / "memory/channels/playing-with-alexbot-scores.json"
    scores_data = load_json(scores_path)
    current_scores = scores_data.get('scores', {})
    
    # Aggregate ALL messages from daily logs (all-time history)
    daily_dir = WORKSPACE / "memory/channels/playing-with-alexbot-daily"
    people = {}
    
    if daily_dir.exists():
        for jsonl_file in sorted(daily_dir.glob("*.jsonl")):
            for entry in load_jsonl(jsonl_file):
                # Format: {ts, from, phone, msg, replyTo, replyToPhone, origMsg, channel, chatId}
                # I'm replying TO someone (replyTo/replyToPhone), and msg contains my reply with score
                sender_phone = normalize_phone(entry.get('replyToPhone', ''))
                sender_name = entry.get('replyTo', 'Unknown')
                
                if not sender_phone or sender_phone == 'bot':
                    continue
                
                if sender_phone not in people:
                    people[sender_phone] = {
                        'jid': sender_phone,
                        'name': sender_name,
                        'totalScore': 0,
                        'messages': 0,
                        'creativity': 0,
                        'challenge': 0,
                        'humor': 0,
                        'cleverness': 0,
                        'engagement': 0,
                        'broke': 0,
                        'hacked': 0,
                    }
                
                people[sender_phone]['messages'] += 1
                
                # Extract scores from my reply (entry['msg'] contains my message with score)
                reply = entry.get('msg', '')
                if '📊 **SCORE:' in reply or '📊 SCORE:' in reply:
                    # Try to extract score numbers
                    # Format: "🎨 Creativity: 5 | 🧠 Challenge: 6 | ..." or similar
                    import re
                    score_line = reply.split('📊')[1].split('\n')[0] if '📊' in reply else ''
                    
                    # Extract total score (e.g., "SCORE: 28/70")
                    total_match = re.search(r'(\d+)/70', score_line)
                    if total_match:
                        people[sender_phone]['totalScore'] += int(total_match.group(1))
                    
                    # Try to extract individual categories more precisely
                    # Look for the format: "🎨 Creativity: 5 |" or "Creativity: 5"
                    for line in reply.split('\n'):
                        # Only process lines that look like score breakdown
                        if '|' in line and any(cat in line for cat in ['Creativity', 'Challenge', 'Humor', 'Cleverness', 'Engagement', 'Broke', 'Hacked']):
                            if 'Creativity:' in line or '🎨' in line:
                                m = re.search(r'Creativity:\s*(\d+)', line)
                                if m: people[sender_phone]['creativity'] += int(m.group(1))
                            if 'Challenge:' in line or '🧠' in line:
                                m = re.search(r'Challenge:\s*(\d+)', line)
                                if m: people[sender_phone]['challenge'] += int(m.group(1))
                            if 'Humor:' in line or '😂' in line:
                                m = re.search(r'Humor:\s*(\d+)', line)
                                if m: people[sender_phone]['humor'] += int(m.group(1))
                            if 'Cleverness:' in line or '💡' in line:
                                m = re.search(r'Cleverness:\s*(\d+)', line)
                                if m: people[sender_phone]['cleverness'] += int(m.group(1))
                            if 'Engagement:' in line or '🔥' in line:
                                m = re.search(r'Engagement:\s*(\d+)', line)
                                if m: people[sender_phone]['engagement'] += int(m.group(1))
                            if 'Broke:' in line or '🚨' in line:
                                m = re.search(r'Broke:\s*(\d+)', line)
                                if m: people[sender_phone]['broke'] += int(m.group(1))
                            if 'Hacked:' in line or '🔓' in line:
                                m = re.search(r'Hacked:\s*(\d+)', line)
                                if m: people[sender_phone]['hacked'] += int(m.group(1))
    
    # Also add today's scores (in case they're not in daily logs yet)
    for jid, data in current_scores.items():
        norm_jid = normalize_phone(jid)
        if norm_jid in people:
            # Already have historical data, just update totals
            people[norm_jid]['totalScore'] += data.get('total', 0)
            people[norm_jid]['messages'] += data.get('count', 0)
        else:
            # New person today
            people[norm_jid] = {
                'jid': norm_jid,
                'name': data.get('name', 'Unknown'),
                'totalScore': data.get('total', 0),
                'messages': data.get('count', 0),
                'creativity': data.get('scores', {}).get('creativity', 0),
                'challenge': data.get('scores', {}).get('challenge', 0),
                'humor': data.get('scores', {}).get('humor', 0),
                'cleverness': data.get('scores', {}).get('cleverness', 0),
                'engagement': data.get('scores', {}).get('engagement', 0),
                'broke': data.get('scores', {}).get('broke', 0),
                'hacked': data.get('scores', {}).get('hacked', 0),
            }
    
    # Calculate average scores
    for person in people.values():
        if person['messages'] > 0:
            person['avgScore'] = round(person['totalScore'] / person['messages'], 1)
        else:
            person['avgScore'] = 0
    
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
