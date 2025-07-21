import { MongoClient } from 'mongodb'

let client
let db

export const connectToDatabase = async (uri) => {
  if (db) {
    return db
  }

  if (!client) {
    client = new MongoClient(uri, {})
    await client.connect()
  }

  db = client.db('focusflow')
  return db
}
