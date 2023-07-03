# Discontext

A simple Discord bot that allows you to search for messages semantically.


## Notes

- I only started this project because I wanted to learn about word embeddings and vector databases, so I'm not sure if I'll ever finish it. If you want to use it, you'll have to figure out how to host it yourself.

- This is clearly still a work in progress. Still needs a lot of work, especially on the database side. Vector databases are relatively easy to use, but hard to maintain.

- Also, the reason I framed it as a Discord bot is because as much as I love the platform, its search functionality is not as good.
I'm not sure if I'll ever get to a point where I can host this bot for others to use, but if I do, I'll update this section.

- One last thing, I'm not sure if I'm using the right abstractions/structure as I'm not very experienced with TypeScript. Though, I tried to leverage some abstraction to make it easier to swap out the database and the embedding service. **If you have any suggestions, please let me know.**


## What is it?

Its main purpose is to help you find messages that you know are in a server (or not), but you can't remember exactly how they were phrased. It uses [OpenAI](https://openai.com/)'s [ada](https://platform.openai.com/docs/models/embeddings) model to generate embeddings for each message and store them in a vector database ([Qdrant](https://qdrant.tech/)). 
<br>
You can then search for messages that are semantically similar to a given query.

#### **P.S. messages that are created before the bot is added to the server are not indexed, thus not searchable (yet)**

## Demo video

https://github.com/f0lio/discontext/assets/36214338/a3dc7675-ece4-4227-9205-cdcc95be6573

## Setup development environment

You need to [create a Discord bot](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot) and [add it to your server](https://discordjs.guide/preparations/adding-your-bot-to-servers.html#bot-invite-links).
<br>
You also need to [create an OpenAI account](https://platform.openai.com/signup/) and [get an API key](https://platform.openai.com/account/api-keys).

```bash
cp .env.template .env # And fill in the missing values
```
Assuming you have [node](https://nodejs.org/en/) and [docker](https://www.docker.com/) installed, you can run the following commands to start the bot in development mode:
```bash
npm install
bash start-db.sh      # Starts a docker container with a vector database
npm run start:dev
```

### TODO (in no particular order)

- [ ] Include a link to the message in the search results
- [ ] Discover the meaning of life
- [ ] Add action buttons to the search results, such as:
  - [ ] Reply to the message
  - [ ] Copy the message
- [ ] Remove some TODOs
- [ ] Add a command to:
  - [ ] Filter messages by author
  - [ ] Filter messages by channel
  - [ ] Filter messages by date
- [ ] Leverage moderation model to handle unsafe content
- [ ] Add more TODOs
