const pool = require('../../config/database');

module.exports = {
    getAllProduct: (callBack) =>{
        pool.query(
            `select pd.productId, pd.productName, ct.categoryName, pd.description, pd.productPrice, br.brandName, pd.imageUrl
            from (products pd left join categories ct on pd.categoryId = ct.categoryId) 
            left join brand br on pd.brandId = br.brandId`, [],
            (error, results, fields)=>{
                if(error){
                    return callBack(error);
                }
                return callBack(null,results);
            }
            
        );
    },
    getProductById:  (id, callBack)=>{
        pool.query(
            `select pd.productId, pd.productName, ct.categoryName, pd.description, pd.productPrice, br.brandName, pd.imageUrl
            from (products pd left join categories ct on pd.categoryId = ct.categoryId) 
            left join brand br on pd.brandId = br.brandId where pd.productId = ?`,
            [id],
            (error, results, fields) => {
                if(error){
                    return callBack(error);
                }
                return callBack(null,results[0]);
            }
        );
    },
    updateProducts: (data, callBack) =>{
        pool.query(
            `update products set productName= ?, productPrice= ?, description= ?, imageUrl= ? where productId = ?`,
            [
                data.productName,
                data.productPrice,
                data.description,
                data.imageUrl,
                data.productId
            ],
            (error, results, fields) => {
                if(error){
                    return callBack(error);
                }
                return callBack(null,results);
            }

        );
    },
    getProductId:  (id, callBack)=>{
        pool.query(
            `select pd.productId, pd.productName, ct.categoryName, pd.description, pd.productPrice, pd.imageUrl
            from products pd inner join categories ct on pd.categoryId = ct.categoryId
            where ct.categoryId = ?`,
            [id],
            (error, results, fields) => {
                if(error){
                    return callBack(error);
                }
                return callBack(null,results);
            }
        );
    },
    viewComment:  (id, callBack)=>{
                    pool.query(
                        `select rv.reviewId, rv.productId, rv.star, rv.comment, rv.userName, rg.userimage
                        from registration rg  inner join review rv
                        on rg.userName = rv.userName
                        where  rv.productId= ?`,
                        [id],
                        (error, results, fields) => {
                            if(error){
                                return callBack(error);
                            }
                            else if (results.toString() == "")
                            {
                                return callBack(error,"No comment");
                            }
                            else
                            {
                                return callBack(null,results)
                            }
                        }
                    );
    },
    searchProduct:(productName, callBack)=>{
        newName = "%"+ productName + "%";
        pool.query(
            `select pd.productId, pd.productName, ct.categoryName, pd.description, pd.productPrice, br.brandName, pd.imageUrl from (products pd left join categories ct on pd.categoryId = ct.categoryId) left join brand br on pd.brandId = br.brandId where pd.productName like N? `,
            [newName],
            (error, results, fields) => {
                if(error){
                    return callBack(error);
                }
                return callBack(null,results);
            }
        );
    },
    createProduct: (data, callBack) =>{
        pool.query(
            `insert into products(productName,categoryId,description,productPrice,imageUrl)
            select ?, ct.categoryId, ?, ?, ?
            from categories ct
            where ct.categoryName = ? `,
            [data.productName, data.description, data.productPrice, data.imageUrl, data.categoryName, data.brandName],
            (error,results,fields)=>{
                if(error){
                    return callBack(error);
                }
                return callBack(null, results.insertId);
            }
        );

    }
}