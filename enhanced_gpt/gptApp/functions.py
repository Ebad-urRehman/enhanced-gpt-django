from openai import OpenAI
client = OpenAI()


def get_chat_response(model, messages, max_tokens, frequency_penalty, no_of_responses, stream):
    # response = client.chat.completions.create(
    #     model=model,
    #     messages=messages,
    #     max_tokens=max_tokens,
    #     frequency_penalty=frequency_penalty,
    #     n=no_of_responses,
    #     stream=stream
    # )
    # return response.choices[0].message.content, response
    return {"dict":12}

if __name__ == "__main__":
    model = "gpt-3.5-turbo"
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "who are you"}
        ]
    max_tokens = 1000;
    response, response_obj = get_chat_response(model, messages, max_tokens)
    print(response_obj, response)