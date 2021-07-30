import Vue from 'vue'
import {
  Button, Form, FormItem, Input, Message,
  Container, Header, Aside, Main, Menu, Submenu, MenuItem,
  Breadcrumb, BreadcrumbItem, Card, Row, Col, Table, TableColumn,
  Pagination, Dialog, MessageBox, Select,
  Option, Alert, Upload, Timeline, TimelineItem, Dropdown, DropdownMenu, DropdownItem, Radio, RadioGroup, RadioButton
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Container)
Vue.use(Input)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
// Vue.use(Switch)
// Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
// Vue.use(Tag)
// Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
// Vue.use(Cascader)
Vue.use(Alert)
// Vue.use(Tabs)
// Vue.use(TabPane)
// Vue.use(Step)
// Vue.use(Steps)
// Vue.use(CheckboxGroup)
// Vue.use(Checkbox)
Vue.use(Upload)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message
