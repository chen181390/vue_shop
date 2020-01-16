<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <div id="main" style="width: 700px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
    import echarts from 'echarts';
    import _ from 'lodash';

    export default {
        name: "Report",
        data() {
            return {
                options: {
                    title: {
                        text: '销量报表'
                    },
                    tooltip: {},
                    legend: {
                        data:['销量']
                    },
                    xAxis: {
                        data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
                    },
                    yAxis: {},
                    series: [{
                        name: '销量',
                        type: 'bar',
                        data: [5, 20, 36, 10, 10, 20]
                    }]
                }
            }
        },
        async mounted() {
            let myChart = echarts.init(document.getElementById('main'));

            const {data: res} = await this.$http.get('reports/type/1');
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg);
            }

            const result = _.merge(res.data, this.options);
            myChart.setOption(result);

        }
    }
</script>

<style lang="less" scoped>

</style>