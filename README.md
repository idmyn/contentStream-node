# contentStream (backend)

contentStream is a Twitter client enabling users to save tweets from their
timeline into different categories to revisit them later. It's built on a MERN
stack and you can find the frontend repo
[here](https://github.com/steve-alex/contentStream-react).

The approach taken to implement this backend was guided by three online articles
in particular. [Bennett Dungan's](https://github.com/Beznet) [post on
dev.to](https://dev.to/beznet/build-a-rest-api-with-node-express-mongodb-4ho4)
was immensely helpful and the basic RESTful scructure here draws heavily from
his. In addition, this implementation of JWT follows
[an article](https://softwareontheroad.com/nodejs-jwt-authentication-oauth/)
by [Sam Quinn](https://twitter.com/SantyPK4). Finally,
[Nathon Amick's](https://github.com/namick)
_[Missing Guide to Twitter OAuth User
Authorization](https://dev.to/namick/the-missing-guide-to-twitter-oauth-user-authorization-9lh)_
was invaluable in our battle against the Twitter API documentation.
