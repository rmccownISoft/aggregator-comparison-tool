function appendToQuery(q, sql, values) {
	if (!q) {
		q = { sql: '', values: [] }
	}
	if (sql) {
		if (Array.isArray(values)) {
			q.values.push(...values)
		} else {
			q.values.push(values)
		}
	}
	return q
}

function addWhere(baseQuery, queryParameters) {
	let query = baseQuery
	// const values
	if (queryParameters.length === 0) {
		return query
	}
	for (const [ key, value ] of Object.entries(queryParameters)) {
		//values.push(key, value)
		//query = query.concat(" AND ?? = ?")
		query = query.concat(` AND ${key} = ${value}`)
	}
	//return [query, values]
	return query
}

module.exports = {
	appendToQuery,
	addWhere,
}
