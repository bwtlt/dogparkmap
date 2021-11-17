exports = async function (payload, response) {
  const atlas = 'mongodb-atlas';
  const db = 'dogparkmap';
  const collection = 'parks';
  switch (context.request.httpMethod) {
    case 'GET': {
      return await context.services
        .get(atlas)
        .db(db)
        .collection(collection)
        .find({})
        .limit(50);
    }
    case 'POST': {
      // Raw request body (if the client sent one).
      // This is a binary object that can be accessed as a string using .text()
      const body = payload.body;

      console.log('Request body:', body.text());

      const body_text = EJSON.parse(body.text());

      if (body.name) {
        const mdb = context.services.get(atlas);
        const requests = mdb.db(db).collection(collection);
        const { insertedId } = await requests.insertOne({
          name: body_text.name,
          position: body_text.position,
        });
        // Respond with an affirmative result
        response.setStatusCode(200);
        response.setBody(
          `Successfully saved ${body_text.name} with _id: ${insertedId}.`
        );
      } else {
        // Respond with a malformed request error
        response.setStatusCode(400);
        response.setBody(
          'Could not find "name" in the webhook request body.'
        );
      }
      break;
    }
    default: {
        break;
    }
  }

    return { msg: 'finished!' };
};
