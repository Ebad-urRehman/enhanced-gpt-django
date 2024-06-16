from openai import OpenAI
import spacy
from collections import Counter
import requests
import base64

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


# image generation
def image_response(model, prompt, n, size, style, quality):
    # if model == "dall-e-3":
    #     response = client.images.generate(
    #         model=model,
    #         prompt=prompt,
    #         n=1,
    #         size=size,
    #         style=style,
    #         quality=quality
    #     )
    # elif model == "dall-e-2":
    #     response = client.images.generate(
    #         model=model,
    #         prompt=prompt,
    #         n=n,
    #         size=size
    #     )
    #
    # urls_list = []
    # image_data = response.data
    # for img_obj in image_data:
    #     urls_list.append(img_obj.url)
    # urls_list.append(size)
    # return urls_list
    # urls_list = ["https://oaidalleapiprodscus.blob.core.windows.net/private/org-7yMSDDPots0mp25LaesEBh5p/user-eJVeNouBg5vAW280BHorayK8/img-tziAA3fW5x3LlcV7uhIRYOp4.png?st=2024-06-15T06%3A39%3A56Z&se=2024-06-15T08%3A39%3A56Z&sp=r&sv=2023-11-03&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-06-14T18%3A52%3A26Z&ske=2024-06-15T18%3A52%3A26Z&sks=b&skv=2023-11-03&sig=E7EEcZ7UAbPrBL943GDCiuOQWIQDc51/tONZRgwCCwQ%3D",
    #                             "https://oaidalleapiprodscus.blob.core.windows.net/private/org-7yMSDDPots0mp25LaesEBh5p/user-eJVeNouBg5vAW280BHorayK8/img-tziAA3fW5x3LlcV7uhIRYOp4.png?st=2024-06-15T06%3A39%3A56Z&se=2024-06-15T08%3A39%3A56Z&sp=r&sv=2023-11-03&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-06-14T18%3A52%3A26Z&ske=2024-06-15T18%3A52%3A26Z&sks=b&skv=2023-11-03&sig=E7EEcZ7UAbPrBL943GDCiuOQWIQDc51/tONZRgwCCwQ%3D",
    #                             "1024x1024"]

    urls_list = ["https://wallpaperflare.com/static/26/262/354/car-sports-car-tuning-digital-art-wallpaper.jpg",
                 "https://live.staticflickr.com/7151/6760135001_58b1c5c5f0_b.jpg",
                 "1024x1024"]
    # urls_list = ["https://live.staticflickr.com/7151/6760135001_58b1c5c5f0_m.jpg",
    #              "https://live.staticflickr.com/7151/6760135001_58b1c5c5f0_m.jpg",
    #              "240x240"]

    # urls_list = ["https://live.staticflickr.com/7151/6760135001_58b1c5c5f0.jpg",
    #              "https://live.staticflickr.com/7151/6760135001_58b1c5c5f0.jpg",
    #              "500x500"]

    return urls_list

def edit_image(image, mask, prompt, n, size):
    client.images.edit(
        image=open(image, "rb"),
        mask=open(mask, "rb"),
        prompt=prompt,
        n=n,
        size=size
    )

def create_image_variations(image, n, size):
    response = client.images.create_variation(
        image=open(image, "rb"),
        n=n,
        size="256x256"
    )


# other function
def url_to_base64(url_list):
    data_url_list = []
    for i in range(len(url_list) - 1):
        # Fetch the image from the URL
        response = requests.get(url_list[i])

        # Check if the request was successful
        if response.status_code != 200:
            raise Exception(f"HTTP error! status: {response.status_code}")

        # Read the image data as binary
        image_data = response.content

        # Encode the binary data to Base64
        base64_data = base64.b64encode(image_data).decode('utf-8')

        # Get the MIME type of the image (e.g., image/jpeg)
        mime_type = response.headers['Content-Type']

        # Format the Base64 data as a data URL
        data_url = f"data:{mime_type};base64,{base64_data}"

        data_url_list.append(data_url)

    return data_url_list

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

    # chat_text = """
    # The `async` function in JavaScript is part of the ES2017 standard and helps in writing asynchronous code in a more synchronous/linear manner. Remember, using the 'await' keyword will pause execution of your asynchronous operations - which could impact performance if not managed correctly. You should try to limit usage of 'await' where possible or manage it within Promise.all() blocks etc...when dealing with lots of operations at once (like API calls).
    # """
    #
    # chat_name = generate_chat_name(chat_text)
    #
    # print(chat_name)

    model = "dall-e-3"
    prompt = "car"
    n=1
    size="1024x1024"
    style='natural'
    quality='hd'
    urls = image_response(model, prompt, n, size, style, quality)
    print(urls)




