'use strict';

const connectToDatabase = require('./db');

module.exports.create = async (event) => {
  try {
    const { db } = await connectToDatabase()
    const { insertedId } = await db.collection('notes')
      .insertOne(JSON.parse(event.body))

    const addedObject = await db.collection('notes')
      .findOne({ _id: insertedId })

    return {
      statusCode: 200,
      body: JSON.stringify(addedObject)
    }
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Could not create the object.'
    }
  }
}

module.exports.getOne = async (event) => {
  try {
    const { db, ObjectId } = await connectToDatabase()
    const foundNote = await db.collection('notes')
      .findOne({ _id: ObjectId(event.pathParameters.id) })

    return {
      statusCode: 200,
      body: JSON.stringify(foundNote)
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Could not fetch the note.'
    }
  }
}

module.exports.getAll = async () => {
  try {
    const { db } = await connectToDatabase()
    const foundNotes = await db.collection('notes')
      .find({})
      .execute()

    return {
      statusCode: 200,
      body: JSON.stringify(foundNotes)
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Could not fetch the notes.'
    }
  }
}

module.exports.update = async (event) => {
  try {
    const { db, ObjectId } = await connectToDatabase()
    await db.collection('notes')
      .updateOne({ _id: ObjectId(event.pathParameters.id) }, JSON.parse(event.body), { upsert: true })

    const updatedNote = await db.collection('notes')
      .findOne({ _id: ObjectId(event.pathParameters.id) })

    return {
      statusCode: 200,
      body: JSON.stringify(updatedNote)
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Could not update the note.'
    }
  }
};

module.exports.delete = async (event) => {
  try {
    const { db, ObjectId } = await connectToDatabase()
    const deletedNote = await db.collection('notes')
      .deleteOne({ _id: ObjectId(event.pathParameters.id) })

    return {
      statusCode: 200,
      body: JSON.stringify(deletedNote)
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Could not delete the note.'
    }
  }
};
