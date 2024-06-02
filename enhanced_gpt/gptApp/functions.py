from openai import OpenAI
client = OpenAI()

def get_chat_response():
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "who are you"}],
        response_format={"type": "json_object"}

    )
    return response.choices[0].message.content