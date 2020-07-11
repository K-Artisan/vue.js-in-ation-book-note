Vue.component('vTable', {
    render: function (h) {
        var _this = this;

        //数据行
        var trs = [];
        this.currentData.forEach(function (row) {
            var tds = [];
            _this.currentColumns.forEach(function (cell) {
                tds.push(h('td', row[cell.key]));
            });
            trs.push(h('tr', tds));
        });

        //表头行
        var ths = [];
        this.currentColumns.forEach(function (col, index) {
            if (col.sortable) {
                ths.push(h('th', [
                    h('span', col.title),
                    // 升序
                    h('a', {
                        class: {
                            on: col._sortType === 'asc'
                        },
                        on: {
                            click: function () {
                                _this.handleSortByAsc(index)
                            }
                        }
                    }, '↑'),
                    // 降序
                    h('a', {
                        class: {
                            on: col._sortType === 'desc'
                        },
                        on: {
                            click: function () {
                                _this.handleSortByDesc(index)
                            }
                        }
                    }, '↓')
                ]));
            } else {
                ths.push(h('th', col.title));
            }
        });

        return h('table', [
            h('thead', [
                h('tr', ths)
            ]),
            h('tbody', trs)
        ])
    },
    props: {
        columns: {
            type: Array,
            default: function () {
                return [];
            }
        },
        data: {
            type: Array,
            default: function () {
                return [];
            }
        }
    },
    data: function () {
        return {
            /*
            为了让排序后的columns和data不影响原始数据，
            给v-table组件的data选项添加两个对应的数据，
            组件所有的操作将在这两个数据上完成，不对原始数据做任何处理 
            */
            currentColumns: [],
            currentData: []
        }
    },
    methods: {
        makeColumns: function () {
            this.currentColumns = this.columns.map(function (col, index) {
                //添加一个字段标识当前列排序的状态，后续使用
                col._sortType = 'normal';
                //添加一个字段标识当前列在原始数组中的索引，后续使用
                col._index = index;
                return col;
            });
        },
        makeData: function () {
            this.currentData = this.data.map(function (row, index) {
                //添加一个字段标识当前行在原始数组中的索引，后续使用
                row._index = index;
                return row;
            });
        },
        handleSortByAsc: function (index) {
            var key = this.currentColumns[index].key;
            this.currentColumns.forEach(function (col) {
                col._sortType = 'normal'; //排序前，先将所有列的排序状态都重置为normal，
            });
            this.currentColumns[index]._sortType = 'asc';

            this.currentData.sort(function (a, b) {
                return a[key] > b[key] ? 1 : -1;
            });
        },
        handleSortByDesc: function (index) {
            var key = this.currentColumns[index].key;
            this.currentColumns.forEach(function (col) {
                col._sortType = 'normal'; //排序前，先将所有列的排序状态都重置为normal，
            });
            this.currentColumns[index]._sortType = 'desc';

            this.currentData.sort(function (a, b) {
                return a[key] < b[key] ? 1 : -1;
            });
        }
    },
    mounted() {
        // v-table 初始化时调用
        this.makeColumns();
        this.makeData();
    },
    watch: {
        /**
         * 当渲染完表格后，父级修改了data数据，
         * 比如增加或删除，v-table的currentData也应该更新，
         * 如果某列已经存在排序状态，更新后应该直接处理一次排序。
         */
        data: function () {
            this.makeData();

            //通过遍历currentColumns来找出是否按某一列进行过排序，
            //如果有，就按照当前排序状态对更新后的数据做一次排序操作
            var sortedColumn = this.currentColumns.filter(function (col) {
                return col._sortType !== 'normal';
            });

            if (sortedColumn.length > 0) {
                if (sortedColumn[0]._sortType === 'asc') {
                    this.handleSortByAsc(sortedColumn[0]._index);
                } else {
                    this.handleSortByDesc(sortedColumn[0]._index);
                }
            }
        }
    }
});