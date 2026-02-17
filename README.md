# RSS Aggre(Gator) CLI
Welcome to Gator, a Command Line Interface for aggregating and browsing RSS feeds.

## Features
Gator supports the following:
- Listing users
- Adding new user profiles
- Logging into other user profiles
- Removing all users and data
- Listing RSS Feeds
- Adding RSS Feeds
- Following saved RSS Feeds
- Unfollowing RSS Feeds
- Aggregating all RSS Feed data
- Browse Recent Posts from followed RSS Feeds

### Commands
- `npm run start register {username}`
  - Adds a new user to the database. Username is required and must be unique.
  - Automatically logs into new user profile.
- `npm run start login {username}`
  - Switches current user to the provided user matching the username. Username is required.
- `npm run start users`
  - Lists all users
- `npm run start reset`
  - Destroys all data saved to database.
  - Warning: running Reset and then attempting to use any commands requiring User profile will fail.
- `npm run start agg {interval_duration}`
  - Fetches and saves data from all saved RSS feeds.
  - Every interval, `agg` fetches one saved RSS Feed.
  - Starts with Feeds that have not yet been fetched or oldest feeds. 
  - Interval duration must be in the format: `1h | 1m | 1s | 1ms`
    - Number is variable but suffix must contain valid time delimiter.
- `npm run start addfeed {feedname} {feedurl}`
  - Adds RSS feed with name and url. 
  - Name is required. 
  - Url is Required and must be Unique.
- `npm run start feeds`
  - Lists all saved RSS Feeds.
- `npm run start follow {feedurl}`
  - Current user begins following RSS Feed with URL.
  - Url is Required.
  - Feed with Url must exist.
- `npm run start following`
  - Lists RSS Feeds that current user is following.
- `npm run start unfollow {feedurl}`
  - Current user unfollows RSS Feed they had been following.
  - Url is required.
  - User must be following Feed with Url to unfollow.
- `npm run start browse {limit}`
  - Lists most recent posts from RSS Feeds the current user is following.
  - Limit is optional, default lists two (2) RSS Feed Items.


## Running this Project
To run this project, please follow the steps below. Make sure you have the prerequisites and then follow the step by step

### Pre-requisites
You will need a few things to get set up:
- A Postgres + Drizzle ORM Compatible SQL Database
- A config file in your Home Directory named `.gatorconfig.json`

#### Postgres Database
For the purposes of this project I self hosted my Postgres Database. You can get your system relevant one here: https://www.postgresql.org/download/

If you decide to go with a non-self hosted option, you may encounter difficulties if you cannot set ssl-mode to false.

#### Config File .gatorconfig.json
The config file necessary for this will be set up as follows:
```
{
  "db_url": "connection_string_goes_here",
  "current_user_name": "username_goes_here"
}
```

The `db_url` property will be the URL to your Postgres Database. In the case of self hosting on a Linux system, you will set the URL as follows:
```
Template: protocol://username:password@host:port/database?sslmode=disable
Example:  postgres://postgres:postgres@localhost:5432/gator?sslmode=disable
``` 

The `current_user_name` property will be set automatically and does not need to be set initially. You will encounter errors if the property does not align with any registered user in the Database.

### Quickstart
To set up and run this project, follow these steps:

#### Setup and Installation
1. Clone this repository
2. Set your `.gatorconfig.json` file with your Database URL
3. Navigate to the project directory
4. Run migrations with `npm run migrate`

#### Initial Usage
1. Register user with `npm run start register {username}`. This will automatically log you in.
2. Add an RSS Feed with `npm run start addfeed {feedname} {feedurl}`. You will automatically begin following this feed.
3. Aggregate RSS Feed Items with `npm run start agg {interval duration}`. 
   1. Interval duration needs to be in the format `1h | 1m | 1s | 1ms`. It will run immediately and then every interval.
   2. You can stop aggregating with `ctrl + c`. It is highly recommended to immediately terminate once the initial run is set for this.
4. You now have valid data for all commands. Enjoy. 

## Roadmap/Additional Features
- [ ] Add sorting and filtering options to the browse command
- [ ] Add pagination to the browse command
- [ ] Add concurrency to the agg command so that it can fetch more frequently
- [ ] Add a search command that allows for fuzzy searching of posts
- [ ] Add bookmarking or liking posts
- [ ] Add a TUI that allows you to select a post in the terminal and view it in a more readable format (either in the terminal or open in a browser)
- [ ] Add an HTTP API (and authentication/authorization) that allows other users to interact with the service remotely
- [ ] Write a service manager that keeps the agg command running in the background and restarts it if it crashes