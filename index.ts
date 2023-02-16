import express from "express"
import { Server } from "socket.io"
import { createServer } from "http";
import { Users, Groups, Sockets, Func, User, Group } from "./src/types"

const port = parseInt(process.env.PORT) || 3000;
const app = express();
const httpServer = createServer(app)
const io = new Server(httpServer)

app.use(express.json());

const users: Users = {};
const groups: Groups = {};
const sockets: Sockets = {};

app.get('/', (_, res) => {
  res.send('<h1>Welcome To Chat Service</h1>');
});

io.on("connection", (socket) => {
  console.log("connect", JSON.stringify(socket));
  socket.emit("success");

  function errorHandler(func: Func) {
    return function () {
      try {
        return func(...(arguments));
      } catch (err) {
        return socket.emit("fail", JSON.stringify(err))
      }
    };
  }

  socket.on(
    "in",
    errorHandler(({ username }) => {
      if (users[username]) return socket.emit("success", users[socket.data.username]);
      
      socket.data.username = username
      const user: User = { username, groupnames: [] }
      sockets[username] = socket;
      users[username] = user;
      Object.keys(users).map((username) => {
        sockets[username].emit("new user", { username });
      });
  
    })
  );

  socket.on(
    "send",
    errorHandler(({ message, to }) => {
      const from = socket.data.username
      sockets[to].emit("new message", { message, from});
      socket.emit("success")
    })
  );

  socket.on(
    "new_group",
    errorHandler(({ groupname }) => {
      const username = socket.data.username
      const group: Group = {
        groupname,
        usernames: [username]
      }
      groups[groupname] = group
      socket.emit("success");
    })
  );

  socket.on(
    "add_group",
    errorHandler(({ groupname, username }) => {
      groups[groupname].usernames.push(username)
      socket.emit("success");
    })
  );

  socket.on(
    "send message to group",
    errorHandler(({ message, groupname }) => {
      const from = socket.data.username
      groups[groupname].usernames.forEach((username) => {
        if (username === from) socket.emit("success")
        else sockets[username].emit("new message", { message, groupname, from });
      });
    })
  );

  socket.on("out", function () {
    const username = socket.data.username
    delete users[username];
    Object.keys(groups).forEach((groupname) => { 
      groups[groupname].usernames = groups[groupname].usernames.filter(v => v === username) 
    });
  });

});

httpServer.listen(port, () => {
  console.warn(`Listening on ${port}`);
});

