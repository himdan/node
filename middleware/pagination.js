function paginatedResult(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const results = {}
        const filters  =  req.query.search?req.query.search:{};
        if (endIndex < await  model.repository.search(filters, undefined,undefined, null,null, true)) {
            results.next = {
                page: page + 1,
                limit: limit
            }
        }
        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            }
        }
        try {
            results.results = await model.repository.search(filters, undefined, undefined, startIndex,limit);
            results.filters = model.repository.getFilterableFields()
            results.filtered  = filters
            res.paginatedResults = results;
            next()
        } catch (e) {
            res.status(500).json({message: e.message, 'line' : e.line})
        }

    }
}

module.exports = paginatedResult
