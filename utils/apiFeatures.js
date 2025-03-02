class APIFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr
    }

    filter() {
        const queryObj = { ...this.queryStr }
        const excludedFields = ['page', 'sort', 'limit', 'fields']
        excludedFields.forEach(el => delete queryObj[el])

        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        
        // console.log(req.query, queryObj, JSON.parse(queryString));
        this.query = this.query.find(JSON.parse(queryString))
        // let query = Tour.find(JSON.parse(queryString))

        return this;
    }

    sorting() {
        // sorting
        if(this.queryStr.sort) {
            const sortQuery = this.queryStr.sort.split(',').join(' ')
            this.query = this.query.sort(sortQuery)
        } else {
            this.query = this.query.sort('_id')
        }

        return this;
    }

    limitFields() {
        // fields limiting
        if(this.queryStr.fields) {
            const fields = this.queryStr.fields.split(',').join(' ');
            // query = query.select('name duration price');
            this.query = this.query.select(fields)
        } else {
            this.query = this.query.select('-__v')
        }

        // this.query = this.query.aggregate([{
        //     $group: {
        //         sum: { $sum: '$ratingsAverage' }
        //     }
        // }])

        return this;
    }

    paginate() {
        const page = this.queryStr.page * 1 || 1;
        const limit = this.queryStr.limit * 1 || 100;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

module.exports = APIFeatures