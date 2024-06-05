from openai import OpenAI
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
#     return ["""The `async` function in JavaScript is part of the ES2017 standard and helps in writing asynchronous code in a more synchronous/linear manner.
#
# Functions declared with the async keyword return a promise. This means two things:
#
# a) If an async function has a return statement, then JavaScript automatically wraps it into a resolved promise with that value.
# b) If an async function throws an error, it gets converted into a rejected promise.
#
# Here is how you use it:
#
# ```javascript
# async function myFunction() {
# return "Hello";
# }
#
# myFunction().then(alert); // This will alert "Hello"
# ```
# Inside this async function, there's the `await` operator can be used that works only inside an `async` function. It causes JavaScript to stop and wait for the promise to resolve or reject before moving on which makes code easier to read and understand.
#
# Example:
# ```javascript
# async function getAPIdata() {
# let response = await fetch('http://api.com/data');
# let data = await response.json();
#
# console.log(data);
# }
# ```
# In traditional promises you have to use `.then()` callback functions whereas using `await`, your code appears linear.
#
# Remember, using the 'await' keyword will pause execution of your asynchronous operations - which could impact performance if not managed correctly. You should try to limit usage of 'await' where possible or manage it within Promise.all() blocks etc...when dealing with lots of operations at once (like API calls).
# Tokens used : 338""", 27]

if __name__ == "__main__":
    model = "gpt-3.5-turbo"
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "who are you"}
        ]
    max_tokens = 1000
    frequency_penalty = 1
    no_of_responses = 1
    stream = False
    response_obj, usage = get_chat_response(model, messages, max_tokens, frequency_penalty, no_of_responses, stream)
    print(response_obj, usage)