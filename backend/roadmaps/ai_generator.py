import json
import requests
from groq import Groq
from django.conf import settings

client = Groq(api_key=settings.GROQ_API_KEY)

def generate_roadmap(goal, experience_level='beginner'):
    prompt = f"""
You are an expert learning coach. Create a structured 4-week learning roadmap.

Goal: {goal}
Experience Level: {experience_level}

Return ONLY a valid JSON object in this exact format:
{{
  "goal": "{goal}",
  "weeks": [
    {{
      "week_number": 1,
      "title": "Week title here",
      "objective": "What the learner will achieve this week",
      "resources": [
        {{
          "title": "Exact resource title",
          "url": "https://exact-url.com",
          "resource_type": "video",
          "description": "Why this resource is useful",
          "duration": "2 hours"
        }}
      ]
    }}
  ]
}}

Rules:
- Create exactly 4 weeks
- Each week has 3-4 resources
- resource_type must be one of: video, article, book, exercise
- Start simple, progressively increase difficulty
- For videos: use ONLY these well-known YouTube videos with real IDs:
  * Python basics: https://www.youtube.com/watch?v=rfscVS0vtbw
  * Use real, famous YouTube tutorial video URLs you are confident exist
  * Format: https://www.youtube.com/watch?v=REAL_VIDEO_ID
- For articles: use ONLY real article URLs from these trusted sites you are confident exist:
  * https://www.freecodecamp.org/news/
  * https://realpython.com/
  * https://www.geeksforgeeks.org/
  * https://developer.mozilla.org/
  * https://www.w3schools.com/
- For books: use https://www.goodreads.com/search?q=BOOK+TITLE
- For exercises: use real URLs from https://www.kaggle.com/learn or https://www.hackerrank.com/domains or https://leetcode.com/problemset/
- Only include URLs you are 100 percent confident exist and are working
- Return ONLY the JSON, no extra text
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=2000,
    )

    content = response.choices[0].message.content.strip()
    content = content.replace('```json', '').replace('```', '').strip()
    roadmap_data = json.loads(content)

    # Verify and fix URLs
    for week in roadmap_data['weeks']:
        for resource in week['resources']:
            url = resource.get('url', '')
            if not url or not url.startswith('http') or not verify_url(url):
                resource['url'] = get_fallback_url(resource['title'], resource['resource_type'])

    return roadmap_data


def verify_url(url):
    try:
        response = requests.head(url, timeout=5, allow_redirects=True)
        return response.status_code < 400
    except:
        return False


def get_fallback_url(title, resource_type):
    query = requests.utils.quote(title)
    if resource_type == 'video':
        return f"https://www.youtube.com/results?search_query={query}+tutorial"
    elif resource_type == 'book':
        return f"https://www.goodreads.com/search?q={query}"
    elif resource_type == 'exercise':
        return f"https://leetcode.com/problemset/?search={query}"
    else:
        return f"https://www.freecodecamp.org/news/search/?query={query}"


def regenerate_week(goal, week_number, difficulty_feedback, completed_topics):
    prompt = f"""
You are an expert learning coach adjusting a learning roadmap.

Original goal: {goal}
Week number: {week_number}
User difficulty feedback: {difficulty_feedback} (1=too easy, 3=perfect, 5=too hard)
Topics already covered: {completed_topics}

The user rated this week as {"too difficult - add more foundational resources" if difficulty_feedback > 3 else "too easy - make it more challenging"}.

Return ONLY a valid JSON object for the adjusted week:
{{
  "week_number": {week_number},
  "title": "Adjusted week title",
  "objective": "Updated objective based on feedback",
  "resources": [
    {{
      "title": "Resource title",
      "url": "https://exact-url.com",
      "resource_type": "video",
      "description": "Why this resource helps",
      "duration": "2 hours"
    }}
  ]
}}

Same URL rules as before - only use real, verified URLs you are 100 percent confident exist.
Return ONLY the JSON, no extra text.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=1000,
    )

    content = response.choices[0].message.content.strip()
    content = content.replace('```json', '').replace('```', '').strip()
    week_data = json.loads(content)

    for resource in week_data['resources']:
        url = resource.get('url', '')
        if not url or not url.startswith('http') or not verify_url(url):
            resource['url'] = get_fallback_url(resource['title'], resource['resource_type'])

    return week_data