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

module.exports = {
	appendToQuery,
}
