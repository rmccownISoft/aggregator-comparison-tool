const { json } = require('express')
const express = require('express')
const config = require('command-line-config').load('./server/config.json')
const mysql = require('mysql')
const { transform, isEqual, isArray, isObject } = require('lodash')
const { query } = require('@isoftdata/utility-db')
const querystring = require('querystring')

const { appendToQuery, addWhere } = require('./helpers')

const webServerPort = config.webServerPort || 9001
const webServer = express()

const replikwandoPool = mysql.createPool({
	connectionLimit: 10,
	database: 'itrackproht',
	host: 'devdb.isoftdata.com',
	user: 'rmccown',
	password: '>5jTJmjN',
})
const aggregatorPool = mysql.createPool({
	connectionLimit: 10,
	database: 'itrackproht',
	host: 'agtest.isoftdata.com',
	user: 'rmccown',
	password: '9qrLYUE6!!',
})

const productCode = 9729957
// Parses body json object
webServer.use(express.json())
webServer.use(express.static('static'))

async function queryRow(pool, finalQuery) {
	const queryOptions = {
		sql: finalQuery,
		values: [],
	}
	const sqlQuery = require('mysql').format(queryOptions.sql, queryOptions.values)
	try {
		return await query(pool, queryOptions)
	} catch (err) {
		console.log('query error: ', err)
		return null
	}
}
function getDifference(origObj, newObj) {
	function changes(newObj, origObj) {
		let arrayIndexCounter = 0
		return transform(newObj, function(result, value, key) {
			if (!isEqual(value, origObj[key])) {
				let resultKey = isArray(origObj) ? arrayIndexCounter++ : key
				result[resultKey] = (isObject(value) && isObject(origObj[key])) ? changes(value, origObj[key]) : value
			}
		})
	}
	return changes(newObj, origObj)
}
// TODO: Handle return if no matching row
async function compareRows(aggregatorConnection, replikwandoConnection, finalQuery) {
	const aggregatorRow = await queryRow(aggregatorConnection, finalQuery)
	const replikwandoRow = await queryRow(replikwandoConnection, finalQuery)
	const diff = getDifference(replikwandoRow, aggregatorRow)

	return {
		aggregator: aggregatorRow[0] || null,
		replikwando: replikwandoRow[0] || null,
		difference: diff[0] || null,
	}
}

// webServer.get('/get-row', async(req, res) => {
// 	console.log("web server get request: ", req.query)
// 	try {
// 		const rows = await compareRows(aggregatorPool, replikwandoPool)
// 		res.json("test")
// 	} catch (err) {
// 		console.log("error getting companyinfo: ", err)
// 	}
// })
webServer.get('/compare-rows/:productcode/:table', async(req, res) => {
	const baseQuery = `SELECT * FROM ${req.params.table} WHERE productcode = ${req.params.productcode}`
	const finalQuery = addWhere(baseQuery, req.query)
	console.log("query: ", finalQuery)
	try {
		const rows = await compareRows(aggregatorPool, replikwandoPool, finalQuery)
		res.json(rows)
	} catch (err) {
		console.log("error getting one or more rows: ", err)
	}
})
webServer.listen(webServerPort, () => console.log(`web server running on port ${webServerPort}`))

