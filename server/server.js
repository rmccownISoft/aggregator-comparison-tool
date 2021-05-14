const { json } = require('express')
const express = require('express')
const config = require('command-line-config').load('./server/config.json')
const mysql = require('mysql')
const { transform, isEqual, isArray, isObject } = require('lodash')
const { query } = require('@isoftdata/utility-db')

const { appendToQuery } = require('./helpers')

const webServerPort = config.webServerPort || 9001
const webServer = express()

const replikwandoPool = mysql.createPool({
	connectionLimit: 10,
	database: 'itrackproht',
	host: 'devdb.isoftdata.com',
	user: '',
	password: '',

})
const aggregatorPool = mysql.createPool({
	connectionLimit: 10,
	database: 'itrackproht',
	host: 'agtest.isoftdata.com',
	user: '',
	password: '',

})

const productCode = 9729957
// Parses body json object
webServer.use(express.json())
webServer.use(express.static('static'))

async function queryRow(pool) {
	const queryOptions = {
		sql: `SELECT * FROM companyinfo WHERE productcode = 9729957 AND store = 1`,
		values: [],
	}
	const sqlQuery = require('mysql').format(queryOptions.sql, queryOptions.values)
	try {
		//console.log("sql query: ", sqlQuery)
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
async function compareRows(aggregatorConnection, replikwandoConnection) {
	const aggregatorRow = await queryRow(aggregatorConnection)
	const replikwandoRow = await queryRow(replikwandoConnection)
	const diff = getDifference(replikwandoRow, aggregatorRow)
	//const rowDiff = inspect(diff, { showHidden: false, depth: null, colors: true })

	return {
		aggregator: aggregatorRow[0] || null,
		replikwando: replikwandoRow[0] || null,
		difference: diff[0] || null,
	}
}

// webServer.get('/get-companyinfo', async(req, res) => {
// 	try {
// 		const response = await queryRow(pool)
// 		console.log("get companyinfo response: ", response[0])
// 		const firstRow = response[0]
// 		res.json(firstRow)
// 	} catch (err) {
// 		console.log("error getting companyinfo: ", err)
// 	}
// })
webServer.get('/get-companyinfo', async(req, res) => {
	console.log("web server get request: ", req)
	try {
		const rows = await compareRows(aggregatorPool, replikwandoPool)
		res.json(rows)
	} catch (err) {
		console.log("error getting companyinfo: ", err)
	}
})
webServer.listen(webServerPort, () => console.log(`web server running on port ${webServerPort}`))

