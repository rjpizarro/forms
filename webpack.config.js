//https://medium.com/@BrodaNoel/how-to-create-a-react-component-and-publish-it-in-npm-668ad7d363ce

var path = require('path');
module.exports = {
    entry: {
        modes: './src/modeConstants.js',
        withActionsButtons: './src/withActionsButtons.js',
        withFormEnhancer: './src/withFormEnhancer.js',
        withFormTitle: './src/withFormTitle.js',
        withGetFieldProps: './src/withGetFieldProps.js',
        withReduxForm: './src/withReduxForm.js',
        withSubmitAndCancelButtons: './src/withSubmitAndCancelButtons.js',
        //components
        FormHeader: './src/components/form-header.js',
        FormFooter: './src/components/form-footer.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        library: 'forms',
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env'],
                        plugins: ['transform-class-properties'],
                    }
                }
            },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            },
        ]
    },
    externals: {
        'react': 'commonjs react' // this line is just to use the React dependency of our parent-testing-project instead of using our own React.
    }
};