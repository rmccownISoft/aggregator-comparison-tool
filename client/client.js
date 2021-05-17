/* global Ractive:readonly */
const makeITButton = require('@isoftdata/button')

new Ractive({
	target: 'body',
	template: require('./client.html'),
	data: {

		aggregatorRow: '',
		replikwandoRow: '',
		differenceRow: '',
		productCode: '',
		fields: [],
		htpTables: [
			{
				table: "companyinfo",
				columns: [ "store" ],
			},
			{
				table: "inventory",
				columns: [ "store", "partnum" ],
			},
			{
				table: "invmaster",
				columns: [ "stocknum", "store" ],
			},
			{
				table: "mnfcrmod",
				columns: [ "typenum", "pmodel" ],
			},
			{
				table: "model",
				columns: [ "Model" ],
			},
			{
				table: "partuse",
				columns: [ "typenum" ],
			},
			{
				table: "partlistauthoritymap",
				columns: [ "sourceid" ],
			},
		],
	},
	components: {
		itButton: makeITButton(),
	},

	oninit() {
		const ractive = this

		ractive.observe('selectedTable', selectedTable => {
			let fields = []
			if (selectedTable) {
				const matchingTable = ractive.get('htpTables')
					.find(table => table.table === selectedTable.table)
				if (matchingTable) {
					fields = matchingTable.columns.map(col => {
						return { label: col, value: '' }
					})
				}
			}
			ractive.set({ fields })
		})
	},

	doFetchAndSet(endPoint, attributes) {
		console.log("fetch and set attributes: ", attributes)
		return doFetch(endPoint, attributes).then(res=> {
			console.log('response: ', res)
			if (res) {
				this.set({ replikwandoRow: res.replikwando })
				this.set({ aggregatorRow: res.aggregator })
				this.set({ differenceRow: res.difference })
			}
		})
	},
	getRows(productCode, tableInfo, fields) {
		const attributes = createReqObj(fields)
		const params = new URLSearchParams(attributes).toString()

		const url = `compare-rows/${productCode}/${tableInfo.table}?${params}`
		this.doFetchAndSet(url, attributes)
		// Fetch the rows
	},
})

async function doFetch(endPoint, data = {}) {
	const res = await fetch(endPoint, data)
	console.log("fetch response: ", res)
	const json = await res.json()

	return json
}

function createReqObj(fields) {
	let reqObj = {}
	fields.forEach(row => {
		reqObj[row.label] = row.value
	})
	return reqObj
}
