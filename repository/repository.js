class Repository  {
    constructor(model, schema) {
        this.model = model
        this.schema = schema
        this.buildQuery = function (data) {
            const query = {};
            for (let prop in data) {
                let propArray = prop.split('_')
                const i = (propArray.length - 1) > 0 ? propArray.length - 1 : 0
                let operator = propArray[i];
                let searchParam = data[prop]
                let mainProp = prop.replace('_' + operator, '');
                if(searchParam){
                    let mainQuery = {}
                    mainQuery['$' + operator] = operator === 'regex'?`.*${searchParam}.*`:searchParam
                    query[mainProp] = mainQuery;
                }

            }
            return query;
        }
        this.getColumnMap = function(order=1) {
            const map = [];
            for (let prop in this.schema) {
                map.push({prop:order});
            }
            return map
        };
    }

    getFilterableFields() {
        const filters = {};
        for (let prop in this.schema) {
            const prop_eq = `${prop}_eq`
            const prop_neq = `${prop}_neq`
            const prop_gt = `${prop}_gt`
            const prop_lt = `${prop}_lt`
            const prop_get = `${prop}_get`
            const prop_let = `${prop}_let`
            const prop_regex = `${prop}_regex`
            switch (this.schema[prop].type) {
                case Boolean:
                    filters[prop_eq] = "";
                    filters[prop_neq] = "";
                    break;
                case Date:
                    filters[prop_eq] = "";
                    filters[prop_neq] = "";
                    filters[prop_let] = "";
                    filters[prop_lt] = "";
                    filters[prop_gt] = "";
                    filters[prop_get] = "";
                    break;
                case String:
                    filters[prop_eq] = "";
                    filters[prop_neq] = "";
                    filters[prop_let] = "";
                    filters[prop_regex] = "";
                    break;
            }
        }
        return filters;
    }



    async search(data, orderField=2, order=-1, skip, limit, getCount) {
        let query = this.buildQuery(data);
        let orderSet = this.getColumnMap(order)[orderField];
        return getCount ? await this.model.countDocuments(query).exec() : await this.model.find(query).limit(limit).skip(skip).sort(orderSet).exec()
    }

};
module.exports = Repository
