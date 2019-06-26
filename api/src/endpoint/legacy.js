const express = require('express')
const Firestore = require('@google-cloud/firestore')

function legacyEndpoint(canonical) {
  const router = express()
  const firestore = new Firestore()

  router.get(
    '/:tokenid',
    async (req, res, next) => {

      let query = firestore.collection('tokens')
        .where('legacyid', '==', req.params.tokenid)
        .select('id')

      try {
        const result = await query.get()
        if (result.empty) {
          res.status(404).end()
        } else {
          const { id } = await result.docs[0].data()
          res.redirect(301, canonical.token(id))
        }
      } catch (err) {
        next(err)
      }
    }
  )

  return router
}

module.exports = legacyEndpoint