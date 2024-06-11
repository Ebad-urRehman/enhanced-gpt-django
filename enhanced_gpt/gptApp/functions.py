from openai import OpenAI
import spacy
from collections import Counter


client = OpenAI()


def get_chat_response(model, messages, max_tokens, frequency_penalty, no_of_responses, stream):
    response = client.chat.completions.create(
        model=model,
        messages=messages,
        max_tokens=max_tokens,
        frequency_penalty=frequency_penalty,
        n=no_of_responses,
        stream=False
    )
    return response.choices[0].message.content, response.usage.total_tokens
    # return ["Hello! How can I assist you today?", 27]
    # return """The `async` function in JavaScript is part of the ES2017 standard and helps in writing asynchronous code in a more synchronous/linear manner. Remember, using the 'await' keyword will pause execution of your asynchronous operations - which could impact performance if not managed correctly. You should try to limit usage of 'await' where possible or manage it within Promise.all() blocks etc...when dealing with lots of operations at once (like API calls).""", 27




# Load spaCy model
nlp = spacy.load("en_core_web_sm")


def generate_chat_name(text):
    # remove system words
    words_to_remove = ['system', 'user', 'content', 'assistant', 'helpful', 'role']
    for word in words_to_remove:
        text = text.replace(word, "")

    # Process the text with spaCy
    doc = nlp(text)

    # Extract keywords (nouns and proper nouns)
    keywords = [token.text for token in doc if token.pos_ in ('NOUN', 'PROPN', 'ADJ') and not token.is_stop]

    # Get the most common words
    common_words = Counter(keywords).most_common()

    # Generate the chat name by combining the most common words
    chat_name = ' '.join(word for word, _ in common_words[:4])
    if chat_name == "" or chat_name is None:
        return "not given"
    return chat_name




if __name__ == "__main__":
    # model = "gpt-3.5-turbo"
    # messages = [
    #     {"role": "system", "content": "You are a helpful assistant."},
    #     {"role": "user", "content": "who are you"}
    #     ]
    # max_tokens = 1000
    # frequency_penalty = 1
    # no_of_responses = 1
    # stream = False
    # response_obj, usage = get_chat_response(model, messages, max_tokens, frequency_penalty, no_of_responses, stream)
    # print(response_obj, usage)

    chat_text = """
    The `async` function in JavaScript is part of the ES2017 standard and helps in writing asynchronous code in a more synchronous/linear manner. Remember, using the 'await' keyword will pause execution of your asynchronous operations - which could impact performance if not managed correctly. You should try to limit usage of 'await' where possible or manage it within Promise.all() blocks etc...when dealing with lots of operations at once (like API calls).
    """

    chat_name = generate_chat_name(chat_text)

    print(chat_name)