module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        open: true,
        proxy: {
            '/':{
                target:'http://localhost:8090',
                ws: false,
                changeOrigin:true
            }
        }
    }
}