/* global Ractive:readonly */
const makeITButton = require('@isoftdata/button')

new Ractive({
	target: 'body',
	template: require('./client.html'),
	data: {
		// msg: {
		// 	signupdate: null,
		// 	vendor_factor: 99,
		// 	system_factor: 0.99,
		// },
		aggregatorRow: '',
		replikwandoRow: '',
		differenceRow: '',
		//columnValue: [],
		htpTables: [

			// {
			// 	table: "companyinfo",
			// 	columns: {
			// 		"store": '',
			// 		"productcode": '',
			// 	},
			// },
			{
				table: "companyinfo",
				columns: [ "productcode", "store" ],
			},
			{
				table: "inventory",
				columns: [ "productcode", "store", "partnum" ],
			},
			{
				table: "invmaster",
				columns: [ "productcode", "stocknum", "store" ],
			},
			{
				table: "mnfcrmod",
				columns: [ "productcode", "typenum", "pmodel", "htpmnfcrmodid" ],
			},
			{
				table: "model",
				columns: [ "productcode", "Model", "htpmodelid" ],
			},
			{
				table: "partuse",
				columns: [ "productcode", "typenum" ],
			},
			{
				table: "partlistauthoritymap",
				columns: [ "productcode", "sourceid" ],
			},
		],
	},
	components: {
		itButton: makeITButton(),
	},
	computed: {
		tableColumns() {
			const selectedTable = this.get('selectedTable')
			const tables = this.get('htpTables')

			if (selectedTable) {
				const matchingTable = tables.find(table => table.table === selectedTable.table)
				//return (matchingTable && matchingTable.columns) || []
				return (matchingTable.columns) || []
			}
			return []
		},
	},
	oninit() {
		const ractive = this
		ractive.observe('selectedTable', table => {
			console.log('selected table: ', table)
			ractive.getColumns(table)
		})

		// Loads a test row
		//ractive.loadReplikwandoRow()
		ractive.observe('tableColumns', tableColumns => {
			//the table columns have changed,
			//come up with default values for the columns
			const fieldValues = tableColumns.reduce((sum, column) => {
				return { ...sum, [column]: '' }
			}, {})
			console.log("field values: ", fieldValues)
			ractive.set({ fieldValues })
		})
	},
	getColumns(table) {
		console.log("columns: ", table.columns)
		return table.columns
	},
	getRows() {
		// const test = this.get('columnValue')
		// get the table and find the matching columns
		// try to run a get on the value for each of the columns
		// log the result
		// run a fetch
		const stuff = this.get('tableColumns')
	},
	doFetchAndSet(endPoint, attributeName) {
		return doFetch(endPoint).then(res=> {
			if (res) {
				console.log("do fetch and set res: ", res)
				this.set({ replikwandoRow: res.replikwando })
				this.set({ aggregatorRow: res.aggregator })
				this.set({ differenceRow: res.difference })
			}
		})
	},
	doFetchAndSetComparison(endPoint) {
		return doFetchComparison(endPoint).then(res=> {
			if (res) {
				console.log(res)
			}
		})
	},
	loadReplikwandoRow() {
		this.doFetchAndSet('get-companyinfo', 'replikwandoRow')
	},
	loadComparisonRows() {
		this.doFetchAndSetComparison('get-companyinfo')
	},
})

async function doFetch(endPoint, data = {}) {
	const res = await fetch(endPoint, data)
	console.log("fetch response: ", res)
	const json = await res.json()

	return json
}

async function doFetchComparison(endPoint, data = {}) {
	const res = await fetch(endPoint, data)
	const json = await res.json()
	return json
}

