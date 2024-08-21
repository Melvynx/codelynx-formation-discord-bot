import Fastify from "fastify";

const usersMap = new Map([
  [
    "user1@example.com",
    {
      user: {
        discordId: "826527359141675019", // glaski
        products: [
          {
            id: "6erjf21",
            title: "Product 1",
            discordRoleId: "1274803816579072010",
          },
          {
            id: "iu34jk",
            title: "Product 2",
            discordRoleId: "pq34ht",
          },
        ],
      },
    },
  ],
  [
    "user2@example.com",
    {
      user: {
        discordId: null,
        products: [
          {
            id: "28ehf4",
            title: "Product 1",
            discordRoleId: "1274803816579072010",
          },
        ],
      },
    },
  ],
  [
    "user3@example.com", //exemple
    {
      user: {
        discordId: "871478436202442775",
        products: [
          {
            id: "3dk291",
            title: "Product 2",
            discordRoleId: "1274803850133377095",
          },
          {
            id: "as83dj",
            title: "Product 3",
            discordRoleId: "1274803884124012596",
          },
          {
            id: "y9fh84",
            title: "Product 4",
            discordRoleId: "1274803924628410482",
          },
        ],
      },
    },
  ],
]);


const app = Fastify({
  logger: true,
});

app.get<{
  Params: {
    email: string;
  };
}>("/api/v1/users/:email", async(req, res) => {
  const email = req.params?.email;
  if (!email) {
    return void res.status(404).send({});
  }

  const user = usersMap.get(email.trim().toLowerCase());

  if (!user) {
    return void res.status(404).send({});
  }

  void res.status(200).send({ user: user });
});

app.patch<{
  Params: {
    email: string;
  };
  Body: {
    discordId?: string;
  };
}>("/api/v1/users/:email", async(req, res) => {
  console.log(req.params);
  console.log(req.body);
  void res.status(200).send(req.body);
});

void app.listen({
  port: 3000,
});