import Vue from 'vue';
import {
  Pagination,
  Dialog,
  Autocomplete,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  OptionGroup,
  Button,
  ButtonGroup,
  Table,
  TableColumn,
  DatePicker,
  TimeSelect,
  TimePicker,
  Popover,
  Tooltip,
  // Breadcrumb,
  // BreadcrumbItem,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tag,
  Tree,
  Alert,
  // Slider,
  Icon,
  Row,
  Col,
  Upload,
  Progress,
  // Badge,
  Card,
  Rate,
  // Steps,
  // Step,
  // Carousel,
  // CarouselItem,
  // Collapse,
  // CollapseItem,
  Cascader,
  ColorPicker,
  // Spinner,
  // Transfer,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Loading,
  MessageBox,
  Message,
  Notification
} from 'element-ui';

Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Autocomplete);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Checkbox);
Vue.use(CheckboxButton);
Vue.use(CheckboxGroup);
Vue.use(Switch);
Vue.use(Select);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(DatePicker);
Vue.use(TimeSelect);
Vue.use(TimePicker);
Vue.use(Popover);
Vue.use(Tooltip);
// Vue.use(Breadcrumb);
// Vue.use(BreadcrumbItem);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Tag);
Vue.use(Tree);
Vue.use(Alert);
// Vue.use(Slider);
Vue.use(Icon);
Vue.use(Row);
Vue.use(Col);
Vue.use(Upload);
Vue.use(Progress);
// Vue.use(Badge);
Vue.use(Card);
Vue.use(Rate);
// Vue.use(Steps);
// Vue.use(Step);
// Vue.use(Carousel);
// Vue.use(CarouselItem);
// Vue.use(Collapse);
// Vue.use(CollapseItem);
Vue.use(Cascader);
Vue.use(ColorPicker);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Footer);

Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;

/** sync from https://github.com/ElemeFE/element/blob/master/components.json
 let json = {
  "pagination": "./packages/pagination/index.js",
  "dialog": "./packages/dialog/index.js",
  "autocomplete": "./packages/autocomplete/index.js",
  "dropdown": "./packages/dropdown/index.js",
  "dropdown-menu": "./packages/dropdown-menu/index.js",
  "dropdown-item": "./packages/dropdown-item/index.js",
  "menu": "./packages/menu/index.js",
  "submenu": "./packages/submenu/index.js",
  "menu-item": "./packages/menu-item/index.js",
  "menu-item-group": "./packages/menu-item-group/index.js",
  "input": "./packages/input/index.js",
  "input-number": "./packages/input-number/index.js",
  "radio": "./packages/radio/index.js",
  "radio-group": "./packages/radio-group/index.js",
  "radio-button": "./packages/radio-button/index.js",
  "checkbox": "./packages/checkbox/index.js",
  "checkbox-button": "./packages/checkbox-button/index.js",
  "checkbox-group": "./packages/checkbox-group/index.js",
  "switch": "./packages/switch/index.js",
  "select": "./packages/select/index.js",
  "option": "./packages/option/index.js",
  "option-group": "./packages/option-group/index.js",
  "button": "./packages/button/index.js",
  "button-group": "./packages/button-group/index.js",
  "table": "./packages/table/index.js",
  "table-column": "./packages/table-column/index.js",
  "date-picker": "./packages/date-picker/index.js",
  "time-select": "./packages/time-select/index.js",
  "time-picker": "./packages/time-picker/index.js",
  "popover": "./packages/popover/index.js",
  "tooltip": "./packages/tooltip/index.js",
  "message-box": "./packages/message-box/index.js",
  "breadcrumb": "./packages/breadcrumb/index.js",
  "breadcrumb-item": "./packages/breadcrumb-item/index.js",
  "form": "./packages/form/index.js",
  "form-item": "./packages/form-item/index.js",
  "tabs": "./packages/tabs/index.js",
  "tab-pane": "./packages/tab-pane/index.js",
  "tag": "./packages/tag/index.js",
  "tree": "./packages/tree/index.js",
  "alert": "./packages/alert/index.js",
  "notification": "./packages/notification/index.js",
  "slider": "./packages/slider/index.js",
  "loading": "./packages/loading/index.js",
  "icon": "./packages/icon/index.js",
  "row": "./packages/row/index.js",
  "col": "./packages/col/index.js",
  "upload": "./packages/upload/index.js",
  "progress": "./packages/progress/index.js",
  "spinner": "./packages/spinner/index.js",
  "message": "./packages/message/index.js",
  "badge": "./packages/badge/index.js",
  "card": "./packages/card/index.js",
  "rate": "./packages/rate/index.js",
  "steps": "./packages/steps/index.js",
  "step": "./packages/step/index.js",
  "carousel": "./packages/carousel/index.js",
  "scrollbar": "./packages/scrollbar/index.js",
  "carousel-item": "./packages/carousel-item/index.js",
  "collapse": "./packages/collapse/index.js",
  "collapse-item": "./packages/collapse-item/index.js",
  "cascader": "./packages/cascader/index.js",
  "color-picker": "./packages/color-picker/index.js",
  "transfer": "./packages/transfer/index.js",
  "container": "./packages/container/index.js",
  "header": "./packages/header/index.js",
  "aside": "./packages/aside/index.js",
  "main": "./packages/main/index.js",
  "footer": "./packages/footer/index.js"
}
 **/
