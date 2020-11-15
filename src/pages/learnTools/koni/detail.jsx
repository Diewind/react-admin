import React, { Component } from 'react'
import {Row,Icon,Tooltip,Button,Form,Input,Card,Menu,Dropdown,Select} from 'antd'
import {FOEM_ITEM_LAYOUT} from '../../../utils/constants'
import G6Editor from '@antv/g6-editor';
import '../mind/index.less';
import koniDatas from './koniDatas.json'

const { TextArea } = Input;
const { Option } = Select;

class KoniDetail extends Component {

    constructor(props){
        super(props);
        this.state = {
            nodeType:'canvas',// 节点类型
            // data:koniDatas
        }
    }

    componentDidMount() {
        this.init();
    }

    /**
     * 初始化页面
     */
    init = () => {
        
        const tool = this.refs.tool;
        const content = this.refs.content;
        const contextmenu = this.refs.contextmenu;
        const detail = this.refs.detail;
        const itempanel = this.refs.itempanel;
        const minimap = this.refs.minimap;
        const editor = new G6Editor();
        const {setFieldsValue} = this.props.form;
        // const {data} = this.state;
        
        const toolBox = new G6Editor.Toolbar({
            container: tool
        });
        const contentBox = new G6Editor.Koni({
            // defaultData: data,
            graph: {
                container: content,
                height: window.innerHeight - 280
            }
        });
        const contextmenuBox = new G6Editor.Contextmenu({
            container: contextmenu
        });
        const itempanelBox =  new G6Editor.Itempannel({
            container: itempanel
        });
        const detailBox = new G6Editor.Detailpannel({
            container: detail
        });
        const minimapBox = new G6Editor.Minimap({
            container: minimap,
            viewportBackStyle:'#fff',
            viewportWindowStyle:'#fff',
            fitView:true,
            width:197
        });
        
        editor.add(toolBox);
        editor.add(contentBox);
        editor.add(contextmenuBox);
        editor.add(detailBox);
        editor.add(itempanelBox);
        editor.add(minimapBox);

        this.editor = editor;
        const currentPage = editor.getCurrentPage();
        // 清空默认选中
        currentPage.clearSelected();
        currentPage.on('click',(ev)=>{
            let nodeName = ev?.item?.model.label || '';
            let nodeType = ev?.item?.type || 'canvas';
            let nodeShape = ev?.item?.shapeObj.type || '';
            this.setState({
                nodeType
            });
            setFieldsValue({
                'labelName': (nodeType === 'edge') ? 'Label' : nodeName,
                'labelShape':nodeShape
            });
        });
        currentPage.on('beforechange', ev=>{
        })

        currentPage.on('afterchange', ev=>{
        })

        currentPage.on('beforeitemselected', ev=>{
        }); // 选中前
        currentPage.on('afteritemselected', ev=>{
            let nodeName = ev?.item?.model.label || '';
            let nodeType = ev?.item?.type || 'canvas';
            const arr = [];
            const edgeArr = [];
            if(ev.item && ev.item.dataMap){
                for (const val of Object.values(ev.item.dataMap)) {
                    if(val['source']){
                        edgeArr.push(val);
                    }else{
                        arr.push(val)
                    }
                }
            }
            this.setState({
                nodeType,
                data:{
                    nodes:[...arr],
                    edges:[...edgeArr]
                }
            });
            setFieldsValue({
                'labelName':nodeName
            });
        }); // 选中后
        currentPage.on('beforeitemunselected', ev=>{
        }); // 取消选中前
        currentPage.on('afteritemunselected', ev=>{
        }); // 取消选中后
        // currentPage.read(data);
    }

    // 设置数据
    handleBlur = () => {
        const currentPage = this.editor.getCurrentPage();
        const curSelect = currentPage.getSelected();
        let {data} = this.state;
        currentPage.read(data);
        currentPage.setSelected(curSelect[0]['model']['id'], true);
    }

    handleChange = (e) => {
        const currentPage = this.editor.getCurrentPage();
        const curSelect = currentPage.getSelected();
        curSelect[0]['model']['label'] = e.target.value;
    }

    handleEdgeChange = (e) => {
        const currentPage = this.editor.getCurrentPage();
        const curSelect = currentPage.getSelected();
        // curSelect[0]['shapeObj']['type'] = e;
        let {data} = this.state;
        let edgesArr = data.edges.map(val=>{
            if(val.source === curSelect[0]['model']['source']){
                val['shape'] = e;
            }
            return val;
        });
        let obj = {
            nodes:data.nodes,
            edges:edgesArr
        }
        currentPage.read(obj);
        currentPage.setSelected(curSelect[0]['model']['id'], true);
    }

    // 导入
    importFile = () => {
        const ndata = koniDatas;
        this.setState({
            data:ndata
        },()=>{
            const currentPage = this.editor.getCurrentPage();
            const {data} = this.state;
            currentPage.read(data);
        });
    }

    // 导出
    exportFileClick = (e) => {
        // const currentPage = this.editor.getCurrentPage();
        // const data = currentPage.save();
    }

    save = () => {
        // const currentPage = this.editor.getCurrentPage();
        // const data = currentPage.save();
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { nodeType }= this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 2 },
                sm: { span: 2 },
            },
            wrapperCol: {
                xs: { span: 21 },
                sm: { span: 21 },
            },
        };
        const menu = (
            <Menu onClick={this.exportFileClick}>
                <Menu.Item key="png">.PNG</Menu.Item>
                <Menu.Item key="pdf">.PDF</Menu.Item>
                <Menu.Item key="mmap">.MMAP</Menu.Item>
            </Menu>
        );
        return (
            <div className="mindbox">
                <div className="mindbox-header">
                    <Row className="mindbox-top" type="flex" justify="end">
                        <Button onClick={this.importFile}>导入</Button>
                        <Dropdown overlay={menu}>
                            <Button>
                                导出 <Icon type="down" />
                            </Button>
                        </Dropdown>
                        <Button onClick={this.save} type='primary'>保存</Button>
                    </Row>
                    <Form {...formItemLayout}>
                        <Form.Item label="标题">
                            {getFieldDecorator('title', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入标题',
                                    },
                                ],
                            })(<Input autoComplete='off' placeholder='拓扑编辑器' />)}
                        </Form.Item>
                        <Form.Item label="描述">
                            {getFieldDecorator('desc', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入描述',
                                    },
                                ],
                            })(<TextArea autoComplete='off' rows={4} placeholder='拓扑结构图是指由网络节点设备和通信介质构成的网络结构图' />)}
                        </Form.Item>
                    </Form>
                </div>
                <div className="mindbox-body">
                    <div className='mindbox-body-hd'>
                        <div className="toolbar" ref='tool'>
                            <div className="command" data-command="undo">
                                <Tooltip title='Undo' placement="bottom">
                                    <span className='toolicon ' role='img'>
                                        <svg id="icon-undo" viewBox="0 0 1024 1024"><path d="M143.14 449.19q69.07-89.09 170.67-140.64Q415.41 257 537.52 256q183.18 4 315.81 114.11T1024 654.39q-58.06-107.11-161.66-170.17-103.6-63.06-232.73-65.06-107.1 1-196.69 45.54-89.58 44.55-152.65 121.62L407.4 713.45q7 7 7 17.01 0 10.01-7 17.02t-17.01 7.01H32.04q-14.01 0-23.02-9.01T0.01 722.46V364.11q0-10.01 7-17.02t17.02-7.01q10.01 0 17.02 7.01l102.1 102.1z"></path></svg>
                                    </span>
                                </Tooltip>
                            </div>
                            <div className="command" data-command="redo">
                                <Tooltip title='Redo' placement="bottom">
                                    <span className='toolicon ' role='img'>
                                        <svg id="icon-redo" viewBox="0 0 1024 1024"><path d="M999.98 340.08q-10.01 0-17.02 7.01l-102.1 102.1q-69.07-89.09-170.67-140.64Q608.59 257 487.48 256q-184.18 4-316.81 114.11T0 654.39q58.06-107.11 161.66-170.17 103.6-63.06 232.73-65.06 107.1 1 197.19 45.54 90.09 44.55 152.15 121.62L616.6 713.45q-7 7-7 17.01 0 10.01 7 17.02t17.01 7.01h358.35q14.01 0 23.02-9.01t9.01-23.02V364.11q0-10.01-7-17.02t-17.01-7.01z"></path></svg>
                                    </span>
                                </Tooltip>
                            </div>
                            <div className="ant-divider ant-divider-vertical" role="separator"></div>
                            <div className="command" data-command="copy">
                                <Tooltip title='Copy' placement="bottom">
                                    <span className='toolicon ' role='img'>
                                        <svg id="icon-copy" viewBox="0 0 1024 1024"><path d="M990.08 1017.64h-549.1q-10.6 0-18.55-8.48-7.95-8.48-9.01-19.08V373.13q1.06-10.6 10.07-18.55 9.01-7.95 23.85-9.01h373.13L1024 549.1v448.4q-5.3 5.3-14.31 12.19-9.01 6.89-19.61 7.95zM814.11 407.06v135.68H949.8L814.11 407.06zM949.8 610.58H746.27V407.06H474.9V949.8h474.9V610.58z m-610.59 67.85H67.84V67.84h271.37v203.53h271.37v-67.84L407.06 0H33.92Q18.02 0 9.01 8.48T0 27.56v684.79q0 10.6 8.48 18.55 8.48 7.95 19.08 9.01h311.65v-61.48z m67.85-610.59l135.68 135.69H407.06V67.84z" fill="#666666"></path></svg>
                                    </span>
                                </Tooltip>
                            </div>
                            <div className="command" data-command="paste">
                                <Tooltip title='Paste' placement="bottom">
                                    <span className='toolicon ' role='img'>
                                        <svg id="icon-paste" viewBox="0 0 1024 1024"><path d="M795.99 199.33h-75.02v-62.16h109.31q10.72 0 19.3 8.58 8.57 8.57 8.57 19.29v102.88h-62.16v-68.59zM240.87 898.05h-75.02V199.33h75.02v-62.16H131.56q-10.72 0-19.29 8.58-8.57 8.57-8.57 19.29v760.88q0 10.71 8.57 18.75t19.29 9.11h102.88l6.43-55.73z m411.52-623.7H309.46V137.17h68.58V62.16q1.07-26.8 18.22-43.94Q413.41 1.08 440.2 0.01h75.01q26.8 1.07 43.94 18.21 17.14 17.14 18.22 43.94v75.01h75.02v137.18zM515.21 62.16H440.2v75.01h75.01V62.16z m405.09 938.77V548.69L720.97 342.93H343.75q-16.08 0-25.19 8.57-9.11 8.57-9.11 19.3v623.7q0 10.72 8.57 18.76 8.57 8.04 19.29 9.11H886q15 4.28 24.11-2.68 9.11-6.97 10.18-18.76z m-68.58-438.31H714.54v-151.1l137.18 151.1z m6.43 411.52H371.61V411.52h280.78v212.19h205.76v350.43z" fill="#666666"></path></svg>
                                    </span>
                                </Tooltip>
                            </div>
                            <div className="command" data-command="delete">
                                <Tooltip title='Delete' placement="bottom">
                                    <span className='toolicon ' role='img'>
                                        <svg id="icon-delete" viewBox="0 0 1024 1024"><path d="M828.55 311.65q-17.81 0-30.05 11.13-12.25 11.13-14.47 28.94l-52.32 529.81h-95.72l16.7-461.91q0-14.47-10.02-25.05-10.02-10.57-25.05-11.13-15.02-0.56-25.6 8.91-10.58 9.46-10.58 25.04l-16.69 464.14H459.01l-15.58-465.25q-1.12-15.58-11.69-25.04-10.57-9.47-25.6-8.91-15.03 0.56-24.49 11.13-9.46 10.57-9.46 25.04l15.58 463.03h-94.6l-52.32-529.81q-2.22-17.81-14.47-28.94-12.24-11.13-30.05-11.13h-3.34q-15.58 2.23-25.04 13.36-9.46 11.13-8.35 26.71l60.1 599.93q3.34 31.17 25.6 51.21 22.26 20.03 53.43 21.14h426.3q31.16-1.11 53.42-21.14t26.72-51.21l58.99-603.27q0-15.58-10.57-26.15-10.58-10.58-25.05-10.58z m107.96-71.23l-7.79-61.22q-5.56-35.62-31.72-57.88-26.15-22.26-61.77-23.37h-170.3l-3.34-32.28q-2.22-28.94-22.25-46.75Q619.3 1.11 590.36 0H433.42Q404.48 1.11 385 18.92q-19.48 17.81-22.82 46.75l-2.22 32.28H188.55q-35.62 1.11-61.22 23.37T96.17 179.2l-8.91 63.44q0 7.79 5.01 12.8 5.01 5.01 12.8 5.01h816.98q6.67-1.11 11.13-6.68 4.46-5.56 3.34-13.35zM422.29 97.95l2.22-27.83q1.12-6.68 8.91-7.79h158.05q6.68 1.11 8.91 7.79l1.11 27.83h-179.2z"></path></svg>
                                    </span>
                                </Tooltip>
                            </div>
                            <div className="ant-divider ant-divider-vertical" role="separator"></div>
                            <div className="command" data-command="zoomIn">
                                <Tooltip title='Zoom In' placement="bottom">
                                    <span className='toolicon' role='img'>
                                        <svg id="icon-zoom-in" viewBox="0 0 1024 1024"><path d="M636.36 411.93q0 17.86-10.12 27.98-10.12 10.12-27.98 10.12H483.97v114.3q0 17.85-10.12 27.97-10.12 10.12-27.98 10.12t-27.98-10.12q-10.12-10.12-10.12-27.97v-114.3H293.48q-17.86 0-27.98-10.12-10.12-10.12-10.12-27.97 0-17.86 10.12-27.98 10.12-10.12 27.98-10.12h114.29v-114.3q0-17.86 10.12-27.98 10.12-10.12 27.98-10.12t27.98 10.12q10.12 10.12 10.12 27.98v114.3h114.29q17.86 0 27.98 10.12 10.12 10.12 10.12 27.97z m342.88 602.43q-17.86 10.71-36.91 9.52-19.05-1.19-32.14-17.86L689.93 754.81q-52.38 40.48-113.7 61.91-61.31 21.43-130.36 21.43-176.2-4.76-295.25-123.81Q31.56 595.28 26.79 419.08q4.77-176.21 123.83-295.26Q269.68 4.77 445.87 0.01q176.2 4.76 295.25 123.81 119.05 119.06 123.83 295.26 0 80.95-26.2 149.41T766.12 694.1l220.25 258.35q11.91 7.14 10.72 25-1.19 17.86-17.86 36.91zM445.87 754.81q146.44-3.57 242.87-100 96.44-96.44 100.01-242.88-3.57-146.44-100.01-242.88-96.43-96.44-242.87-100.01-146.44 3.57-242.88 100.01-96.44 96.44-100.01 242.88 3.57 146.44 100.01 242.88 96.44 96.43 242.88 100z" fill="#666666"></path></svg>
                                    </span>
                                </Tooltip>
                            </div>
                            <div className="command" data-command="zoomOut">
                                <Tooltip title='Zoom Out' placement="bottom">
                                    <span className='toolicon' role='img'>
                                        <svg id="icon-zoom-out" viewBox="0 0 1024 1024"><path d="M636.36 411.93q0 17.86-10.12 27.98-10.12 10.12-27.98 10.12H293.48q-17.86 0-27.98-10.12-10.12-10.12-10.12-27.97 0-17.86 10.12-27.98 10.12-10.12 27.98-10.12h304.78q17.86 0 27.98 10.12 10.12 10.12 10.12 27.97z m342.88 602.43q-17.86 10.71-36.91 9.52-19.05-1.19-32.14-17.86L689.93 754.81q-52.38 40.48-113.7 61.91-61.31 21.43-130.36 21.43-176.2-4.76-295.25-123.81Q31.56 595.28 26.79 419.08q4.77-176.21 123.83-295.26Q269.68 4.77 445.87 0.01q176.2 4.76 295.25 123.81 119.05 119.06 123.83 295.26 0 80.95-26.2 149.41T766.12 694.1l220.25 258.35q11.91 7.14 10.72 25-1.19 17.86-17.86 36.91zM445.87 754.81q146.44-3.57 242.87-100 96.44-96.44 100.01-242.88-3.57-146.44-100.01-242.88-96.43-96.44-242.87-100.01-146.44 3.57-242.88 100.01-96.44 96.44-100.01 242.88 3.57 146.44 100.01 242.88 96.44 96.43 242.88 100z" fill="#666666"></path></svg>
                                    </span>
                                </Tooltip>
                            </div>
                            <div className="command" data-command="autoZoom">
                                <Tooltip title='Fit Map' placement="bottom">
                                    <span className='toolicon' role='img'>
                                        <svg id="icon-fit-map" viewBox="0 0 1024 1024"><path d="M708.913 275.697V39.39q0-18.46 10.47-28.92T748.303 0.01q18.46 0 28.92 10.46t10.46 28.92v196.928H984.61q18.46 0 28.92 10.46t10.46 28.92q0 18.46-10.46 28.929-10.46 10.46-28.92 10.46H748.303q-6.16 0-11.69-1.23-5.53-1.23-11.7-6.16h-8.61q0-12.31-3.69-19.07-3.7-6.76-3.7-12.93zM275.687 0.01q-18.46 0-28.92 10.46t-10.46 28.92v196.928H39.38q-18.46 0-28.92 10.46T0 275.698q0 18.46 10.46 28.929 10.46 10.46 28.92 10.46h236.307q6.16 0 11.69-1.23 5.54-1.23 11.69-6.16h8.61q4.93-6.15 6.16-12.31 1.23-6.15 1.23-12.31V46.77q0-23.39-10.46-35.08Q294.137 0 275.677 0zM984.61 708.923H748.303q-6.16 0-11.69 1.23-5.53 1.23-11.7 6.16h-8.61q-4.93 6.15-6.16 12.31-1.23 6.15-1.23 12.3V977.23q0 17.23 10.47 27.69t28.92 10.46q18.46 0 28.92-10.46t10.46-27.69V787.692H984.61q18.46 0 28.92-10.46t10.46-28.92q0-18.46-10.46-28.919-10.46-10.47-28.92-10.47z m-676.923 16q-12.31-12.3 0 0-12.31-6.15-19.07-11.07-6.76-4.93-12.93-4.93H39.38q-18.46 0-28.92 10.47T0 748.313q0 18.46 10.46 28.92t28.92 10.46h196.928V984.62q0 18.46 10.46 28.92t28.92 10.46q18.46 0 28.929-10.46 10.46-10.46 10.46-28.92V748.313q0-6.16-3.69-11.69-3.69-5.53-3.69-11.7z m204.308-370.456q-66.46 1.23-111.379 46.16-44.93 44.929-46.16 111.378 1.23 66.46 46.16 111.379t111.379 46.15q66.46-1.23 111.379-46.15t46.15-111.379q-1.23-66.46-46.15-111.379-44.92-44.93-111.379-46.16z" fill="#666666"></path></svg>
                                    </span>
                                </Tooltip>
                            </div>
                            <div className="command" data-command="resetZoom">
                                <Tooltip title='Actual Size' placement="bottom">
                                    <span className='toolicon' role='img'>
                                        <svg id="icon-actual-size" viewBox="0 0 1024 1024"><path d="M128 0h85.33v1024H128V0z m682.67 0H896v1024h-85.33V0zM469.33 256h85.34v85.33h-85.34V256z m0 341.33h85.34v85.34h-85.34v-85.34z" fill="#666666"></path></svg>
                                    </span>
                                </Tooltip>
                            </div>
                            <div className="ant-divider ant-divider-vertical" role="separator"></div>
                            <div className="command" data-command="toBack">
                                <Tooltip title='To Back' placement="bottom">
                                    <span className='toolicon' role='img'>
                                        <svg id="icon-to-back" viewBox="0 0 1024 1024"><path d="M720.86 373.26l-94.8-12.84L739.62 259.7q4.94-4.93 7.9-12.83t-1.97-12.84q0-8.89-7.41-13.83-7.41-4.93-17.28-4.93l-94.8-12.84 113.56-100.72q4.94-4.94 7.9-12.84 2.96-7.9-1.97-12.84 0-8.88-7.41-13.82-7.41-4.94-17.28-4.94L360.43 0q-4.93 0-9.87 0.98-4.94 0.98-8.89 5.92L25.68 234.02q-4.93 4.94-8.88 12.84-3.95 7.9-3.95 12.83 0 8.89 6.91 13.82 6.91 4.94 11.85 4.94l107.63 25.68-120.47 87.88q-4.94 4.94-8.4 12.84-3.46 7.9-3.46 12.83 0 4.94 6.42 11.36 6.42 6.42 12.34 7.41l106.65 25.67-119.48 87.89q-4.94 4.93-8.89 12.83T0 575.68q0.99 8.89 7.41 13.83 6.42 4.93 11.36 4.93l379.19 88.87q4.94 0 12.83-0.99 7.9-0.99 12.84-5.93l297.23-265.63q4.94-4.93 7.4-12.33 2.47-7.41-1.49-12.35 8.89-4.94 6.42-8.89-2.47-3.95-12.34-3.95zM360.43 51.35L657.66 94.8 410.79 310.06l-310.06-76.03 259.7-182.68zM215.28 315.99l201.44 51.35q5.92 0 13.33-0.99t12.34-5.93l132.32-119.48 82.95 11.85-246.87 215.27-310.06-76.04 114.55-76.03zM929.21 449.3h94.8L884.78 626.05 745.55 449.3h94.79v-12.84q0-71.1-21.73-132.81-21.73-61.71-60.24-114.05 77.02 39.5 123.44 108.62 46.41 69.13 47.39 151.09z" fill="#666666"></path></svg>
                                    </span>
                                </Tooltip>
                            </div>
                            <div className="command" data-command="toFront">
                                <Tooltip title='To Front' placement="bottom">
                                    <span className='toolicon' role='img'>
                                        <svg id="icon-to-front" viewBox="0 0 1024 1024"><path d="M758.38 392.02q-4.94-8.88-10.37-13.82-5.43-4.94-15.3-4.94l-100.72-12.84L745.55 259.7q4.93-4.93 7.89-12.83 2.97-7.9-0.98-12.84-4.94-8.89-10.87-13.83-5.93-4.93-14.82-4.93l-100.72-12.84 113.56-100.72q4.94-4.94 7.9-12.84 2.96-7.9-1.97-12.84-3.95-8.88-9.88-13.82-5.92-4.94-14.81-4.94L353.51 0q-4.94 0-12.35 0.98-7.4 0.98-12.33 5.92L12.84 234.02q-4.94 4.94-8.89 12.84Q0 254.76 0 259.69q0.99 8.89 7.41 13.82 6.42 4.94 11.36 4.94l113.56 25.68-119.48 87.88q-4.94 4.94-8.89 12.84-3.95 7.9-3.95 12.84 0.99 8.88 7.41 13.82 6.42 4.94 11.36 4.94l113.56 25.67-119.48 87.89q-4.94 4.93-8.89 12.83T0.02 575.68q0.99 8.89 7.41 13.83 6.42 4.93 11.36 4.93l386.1 94.8q4.94 0 12.35-0.99 7.4-0.99 12.34-4.94l303.15-265.62q18.76-4.94 22.71-12.84 3.95-7.9 2.96-12.84z m-543.1-76.03l201.44 51.35q5.92 0 13.33-0.99t12.34-5.93l132.32-119.48 82.95 11.85-246.87 215.27-315.98-76.04 120.47-76.03z m201.44 315.99l-315.99-75.05 107.63-76.04 202.43 50.37q4.94 0 12.35-0.99 7.4-0.99 13.33-4.94l132.32-120.47 81.96 12.84-234.03 214.28z m468.06-442.39l139.23 177.75h-94.8q-5.92 85.91-53.32 153.06-47.4 67.14-123.43 105.65Q789.98 573.72 811.7 512q21.73-61.72 22.72-132.81v-11.85h-94.8l145.16-177.75z" fill="#666666"></path></svg>
                                    </span>
                                </Tooltip>
                            </div>
                            <div className="ant-divider ant-divider-vertical" role="separator"></div>
                            <div className="command" data-command="multiSelect">
                                <Tooltip title='Multi Select' placement="bottom">
                                    <span className='toolicon' role='img'>
                                        <svg id="icon-multi-select" viewBox="0 0 1024 1024"><path d="M0 136.53h68.27v68.27H0v-68.27z m0 136.54h68.27v68.26H0v-68.26zM0 409.6h68.27v68.27H0V409.6z m0 136.53h68.27v68.27H0v-68.27z m0 136.54h68.27v68.26H0v-68.26z m0-614.4V0h68.27v68.27H0z m136.53 0V0h68.27v68.27h-68.27z m136.54 0V0h68.26v68.27h-68.26z m136.53 0V0h68.27v68.27H409.6z m136.53 0V0h68.27v68.27h-68.27z m136.54 0V0h68.26v68.27h-68.26zM819.2 0h68.27v68.27H819.2V0z m0 136.53h68.27v68.27H819.2v-68.27z m0 136.54h68.27v68.26H819.2v-68.26z m0 136.53h68.27v68.27H819.2V409.6z m0 136.53h68.27v68.27H819.2v-68.27zM0 887.47V819.2h68.27v68.27H0z m136.53 0V819.2h68.27v68.27h-68.27z m136.54 0V819.2h68.26v68.27h-68.26z m136.53 0V819.2h68.27v68.27H409.6z m409.6-68.27V682.67h68.27V819.2H1024v68.27H887.47V1024H819.2V887.47H682.67V819.2H819.2z m-273.07 68.27V819.2h68.27v68.27h-68.27zM409.6 273.07v68.26h273.07v-68.26H409.6z m0-68.27h273.07q30.93 0 49.6 18.66 18.66 18.66 18.66 49.6v68.26q0 30.94-18.66 49.61-18.66 18.67-49.6 18.67H409.6q-30.93 0-49.6-18.67t-18.67-49.61v-68.26q0-30.94 18.67-49.6t49.6-18.66zM204.8 546.13v68.27h273.07v-68.27H204.8z m0-68.26h273.07q30.93 0 49.6 18.67 18.66 18.67 18.66 49.59v68.27q0 30.93-18.66 49.6-18.67 18.67-49.6 18.67H204.8q-30.93 0-49.6-18.67t-18.67-49.6v-68.27q0-30.93 18.67-49.59 18.67-18.67 49.6-18.67z" fill="#666666"></path></svg>
                                    </span>
                                </Tooltip>
                            </div>
                            <div className="command" data-command="addGroup">
                                <Tooltip title='Add Group' placement="bottom">
                                    <span className='toolicon' role='img'>
                                        <svg id="icon-group" viewBox="0 0 1024 1024"><path d="M307.2 307.2v68.27h409.6V307.2H307.2z m0-68.27h409.6q30.93 0 49.6 18.67t18.67 49.6v68.27q0 30.93-18.67 49.59-18.67 18.67-49.6 18.67H307.2q-30.93 0-49.6-18.67t-18.67-49.59V307.2q0-30.93 18.67-49.6t49.6-18.67z m0 341.34v68.26h409.6v-68.26H307.2z m0-68.27h409.6q30.93 0 49.6 18.66 18.67 18.67 18.67 49.61v68.26q0 30.94-18.67 49.61-18.67 18.66-49.6 18.66H307.2q-30.93 0-49.6-18.66t-18.67-49.61v-68.26q0-30.94 18.67-49.61Q276.27 512 307.2 512zM102.4 204.8q-42.67-1.07-72-30.4T0 102.4q1.07-42.67 30.4-72t72-30.4q42.67 1.07 72 30.4t30.4 72q-1.07 42.67-30.4 72t-72 30.4z m0-68.27q16 0 25.06-9.06 9.06-9.06 9.06-25.06 0-16-9.06-25.06-9.06-9.07-25.06-9.07-16 0-25.06 9.07-9.07 9.06-9.07 25.06 0 16 9.07 25.06 9.06 9.06 25.06 9.06z m819.2 68.27q-42.67-1.07-72-30.4t-30.4-72q1.07-42.67 30.4-72t72-30.4q42.67 1.07 72 30.4t30.4 72q-1.07 42.67-30.4 72t-72 30.4z m0-68.27q16 0 25.06-9.06 9.07-9.06 9.07-25.06 0-16-9.07-25.06-9.06-9.07-25.06-9.07-16 0-25.06 9.07-9.07 9.06-9.07 25.06 0 16 9.07 25.06 9.06 9.06 25.06 9.06zM102.4 1024q-42.67-1.07-72-30.4T0 921.6q1.07-42.67 30.4-72t72-30.4q42.67 1.07 72 30.4t30.4 72q-1.07 42.67-30.4 72t-72 30.4z m0-68.27q16 0 25.06-9.07 9.06-9.06 9.06-25.06 0-16-9.06-25.06-9.06-9.07-25.06-9.07-16 0-25.06 9.07-9.07 9.06-9.07 25.06 0 16 9.07 25.06 9.06 9.07 25.06 9.07zM921.6 1024q-42.67-1.07-72-30.4t-30.4-72q1.07-42.67 30.4-72t72-30.4q42.67 1.07 72 30.4t30.4 72q-1.07 42.67-30.4 72t-72 30.4z m0-68.27q16 0 25.06-9.07 9.07-9.06 9.07-25.06 0-16-9.07-25.06-9.06-9.07-25.06-9.07-16 0-25.06 9.07-9.07 9.06-9.07 25.06 0 16 9.07 25.06 9.06 9.07 25.06 9.07z m-676.27-819.2V68.27h68.27v68.26h-68.27z m136.54 0V68.27h68.26v68.26h-68.26z m136.53 0V68.27h68.27v68.26H518.4z m136.53 0V68.27h68.27v68.26h-68.27zM68.27 273.07h68.26v68.26H68.27v-68.26z m0 136.53h68.26v68.27H68.27V409.6z m0 136.53h68.26v68.27H68.27v-68.27z m0 136.54h68.26v68.26H68.27v-68.26z m819.2-409.6h68.26v68.26h-68.26v-68.26z m0 136.53h68.26v68.27h-68.26V409.6z m0 136.53h68.26v68.27h-68.26v-68.27z m0 136.54h68.26v68.26h-68.26v-68.26zM245.33 955.73v-68.26h68.27v68.26h-68.27z m136.54 0v-68.26h68.26v68.26h-68.26z m136.53 0v-68.26h68.27v68.26H518.4z m136.53 0v-68.26h68.27v68.26h-68.27z" fill="#666666"></path></svg>
                                    </span>
                                </Tooltip>
                            </div>
                            <div className="command" data-command="unGroup">
                                <Tooltip title='Un Group' placement="bottom">
                                    <span className='toolicon' role='img'>
                                        <svg id="icon-ungroup" viewBox="0 0 1024 1024"><path d="M716.8 238.93H307.2q-30.93 0-49.6 18.67t-18.67 49.6v68.27q0 30.93 18.67 49.59 18.67 18.67 49.6 18.67h409.6q30.93 0 49.6-18.67t18.67-49.59V307.2q0-30.93-18.67-49.6t-49.6-18.67z m0 136.54H307.2V307.2h409.6v68.27z m0 136.53H307.2q-30.93 0-49.6 18.66-18.67 18.67-18.67 49.61v68.26q0 30.94 18.67 49.61 18.67 18.66 49.6 18.66h409.6q30.93 0 49.6-18.66t18.67-49.61v-68.26q0-30.94-18.67-49.61Q747.73 512 716.8 512z m0 136.53H307.2v-68.26h409.6v68.26zM102.4 0q-42.67 1.07-72 30.4T0 102.4q1.07 42.67 30.4 72t72 30.4q42.67-1.07 72-30.4t30.4-72q-1.07-42.67-30.4-72T102.4 0z m0 136.53q-16 0-25.06-9.06-9.07-9.06-9.07-25.06 0-16 9.07-25.06 9.06-9.07 25.06-9.07 16 0 25.06 9.07 9.06 9.06 9.06 25.06 0 16-9.06 25.06-9.06 9.06-25.06 9.06z m819.2 68.27q42.67-1.07 72-30.4t30.4-72q-1.07-42.67-30.4-72T921.6 0q-42.67 1.07-72 30.4t-30.4 72q1.07 42.67 30.4 72t72 30.4z m0-136.53q16 0 25.06 9.07 9.07 9.06 9.07 25.06 0 16-9.07 25.06-9.06 9.06-25.06 9.06-16 0-25.06-9.06-9.07-9.06-9.07-25.06 0-16 9.07-25.06 9.06-9.07 25.06-9.07z m-819.2 716.8q-42.67 1.06-72 30.39Q1.07 844.8 0 887.47q1.07 42.66 30.4 71.99 29.33 29.34 72 30.41 42.67-1.07 72-30.41 29.33-29.33 30.4-71.99-1.07-42.67-30.4-72.01-29.33-29.33-72-30.39z m0 136.53q-16 0-25.06-9.06-9.07-9.07-9.07-25.07t9.07-25.07q9.06-9.07 25.06-9.07 16 0 25.06 9.07 9.06 9.07 9.06 25.07t-9.06 25.07q-9.06 9.06-25.06 9.06z m819.2-136.53q-42.67 1.06-72 30.39-29.33 29.34-30.4 72.01 1.07 42.66 30.4 71.99 29.33 29.34 72 30.41 42.67-1.07 72-30.41 29.33-29.33 30.4-71.99-1.07-42.67-30.4-72.01-29.33-29.33-72-30.39z m0 136.53q-16 0-25.06-9.06-9.07-9.07-9.07-25.07t9.07-25.07q9.06-9.07 25.06-9.07 16 0 25.06 9.07 9.07 9.07 9.07 25.07t-9.07 25.07q-9.06 9.06-25.06 9.06z" fill="#666666"></path></svg>
                                    </span>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                    <div className="mindbox-body-bd">
                        <div className="mindbox-body-bd-sidebar mindbox-body-bd-flow-sidebar-left" ref='itempanel'>
                            <Card>
                                <div className="optbox">
                                <img draggable="false"
                                    src="https://gw.alipayobjects.com/zos/rmsportal/NKmorGEesOtYawmMJkhi.svg"
                                    alt=""
                                    data-type="node" data-size="40" data-color="#69C0FF" data-label="Bank" className="getItem" />
                                </div>
                                <div className="optbox">
                                <img draggable="false"
                                    src="https://gw.alipayobjects.com/zos/rmsportal/qXItsPCgijgVkgLiattJ.svg"
                                    alt=""
                                    data-type="node" data-size="40" data-color="#5CDBD3" data-label="Person" className="getItem"/>
                                </div>
                                <div className="optbox">
                                <img draggable="false"
                                    src="https://gw.alipayobjects.com/zos/rmsportal/msMyjRAdZvDOLOeimTYF.svg"
                                    alt=""
                                    data-type="node" data-size="40" data-color="#B37FEB" data-label="Country" className="getItem"/>
                                </div>
                            </Card>
                        </div>
                        <div className="mindbox-body-bd-content" ref='content'></div>
                        <div className="mindbox-body-bd-sidebar" ref='sidebar'>
                            <Card className='mindbox-body-bd-sidebar-nodeinfo' size='small' type="inner" title={nodeType}>
                                {(nodeType === 'node' || nodeType === 'edge') && <Form layout='horizontal'>
                                    <Form.Item label="Label" {...FOEM_ITEM_LAYOUT}>
                                        {getFieldDecorator('labelName', {
                                            
                                        })(<Input autoComplete='off' onChange={this.handleChange} onBlur={this.handleBlur} />)}
                                    </Form.Item>
                                </Form>}
                                {nodeType === 'edge' && <Form layout='horizontal'>
                                    <Form.Item label="Shape" {...FOEM_ITEM_LAYOUT}>
                                        {getFieldDecorator('labelShape', {
                                            
                                        })(
                                            <Select onChange={this.handleEdgeChange}>
                                                <Option value="flow-smooth">Smooth</Option>
                                                <Option value="flow-polyline">Polyline</Option>
                                                <Option value="flow-polyline-round">Polyline Round</Option>
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Form>}
                            </Card>
                            <Card size='small' type="inner" title='minimap'>
                                <div className="minimap" ref='minimap'></div>
                            </Card>
                        </div>
                    </div>
                    <div className="mindbox-body-contextmenu" ref="contextmenu">
                        <div className="mindbox-body-contextmenu-detail" ref='detail'>
                            <div class="menu" data-status="node-selected">
                                <div class="command" data-command="copy">
                                    <div class="context-menu-index-item">
                                        <span role="img" class="anticon">
                                            <svg id="icon-copy" viewBox="0 0 1024 1024"><path d="M990.08 1017.64h-549.1q-10.6 0-18.55-8.48-7.95-8.48-9.01-19.08V373.13q1.06-10.6 10.07-18.55 9.01-7.95 23.85-9.01h373.13L1024 549.1v448.4q-5.3 5.3-14.31 12.19-9.01 6.89-19.61 7.95zM814.11 407.06v135.68H949.8L814.11 407.06zM949.8 610.58H746.27V407.06H474.9V949.8h474.9V610.58z m-610.59 67.85H67.84V67.84h271.37v203.53h271.37v-67.84L407.06 0H33.92Q18.02 0 9.01 8.48T0 27.56v684.79q0 10.6 8.48 18.55 8.48 7.95 19.08 9.01h311.65v-61.48z m67.85-610.59l135.68 135.69H407.06V67.84z" fill="#666666"></path></svg>
                                        </span>
                                        <span>Copy</span>
                                    </div>
                                </div>
                                <div class="command" data-command="delete">
                                    <div class="context-menu-index-item">
                                        <span role="img" class="anticon">
                                            <svg id="icon-delete" viewBox="0 0 1024 1024"><path d="M828.55 311.65q-17.81 0-30.05 11.13-12.25 11.13-14.47 28.94l-52.32 529.81h-95.72l16.7-461.91q0-14.47-10.02-25.05-10.02-10.57-25.05-11.13-15.02-0.56-25.6 8.91-10.58 9.46-10.58 25.04l-16.69 464.14H459.01l-15.58-465.25q-1.12-15.58-11.69-25.04-10.57-9.47-25.6-8.91-15.03 0.56-24.49 11.13-9.46 10.57-9.46 25.04l15.58 463.03h-94.6l-52.32-529.81q-2.22-17.81-14.47-28.94-12.24-11.13-30.05-11.13h-3.34q-15.58 2.23-25.04 13.36-9.46 11.13-8.35 26.71l60.1 599.93q3.34 31.17 25.6 51.21 22.26 20.03 53.43 21.14h426.3q31.16-1.11 53.42-21.14t26.72-51.21l58.99-603.27q0-15.58-10.57-26.15-10.58-10.58-25.05-10.58z m107.96-71.23l-7.79-61.22q-5.56-35.62-31.72-57.88-26.15-22.26-61.77-23.37h-170.3l-3.34-32.28q-2.22-28.94-22.25-46.75Q619.3 1.11 590.36 0H433.42Q404.48 1.11 385 18.92q-19.48 17.81-22.82 46.75l-2.22 32.28H188.55q-35.62 1.11-61.22 23.37T96.17 179.2l-8.91 63.44q0 7.79 5.01 12.8 5.01 5.01 12.8 5.01h816.98q6.67-1.11 11.13-6.68 4.46-5.56 3.34-13.35zM422.29 97.95l2.22-27.83q1.12-6.68 8.91-7.79h158.05q6.68 1.11 8.91 7.79l1.11 27.83h-179.2z"></path></svg>
                                        </span>
                                        <span>Delete</span>
                                    </div>
                                </div>
                            </div>
                            <div class="menu" data-status="canvas-selected">
                                <div class="command" data-command="undo">
                                    <div class="context-menu-index-item">
                                        <span role="img" class="anticon">
                                            <svg id="icon-undo" viewBox="0 0 1024 1024"><path d="M143.14 449.19q69.07-89.09 170.67-140.64Q415.41 257 537.52 256q183.18 4 315.81 114.11T1024 654.39q-58.06-107.11-161.66-170.17-103.6-63.06-232.73-65.06-107.1 1-196.69 45.54-89.58 44.55-152.65 121.62L407.4 713.45q7 7 7 17.01 0 10.01-7 17.02t-17.01 7.01H32.04q-14.01 0-23.02-9.01T0.01 722.46V364.11q0-10.01 7-17.02t17.02-7.01q10.01 0 17.02 7.01l102.1 102.1z"></path></svg>
                                        </span>
                                        <span>Undo</span>
                                    </div>
                                </div>
                                <div class="command" data-command="redo">
                                    <div class="context-menu-index-item">
                                        <span role="img" class="anticon">
                                            <svg id="icon-redo" viewBox="0 0 1024 1024"><path d="M999.98 340.08q-10.01 0-17.02 7.01l-102.1 102.1q-69.07-89.09-170.67-140.64Q608.59 257 487.48 256q-184.18 4-316.81 114.11T0 654.39q58.06-107.11 161.66-170.17 103.6-63.06 232.73-65.06 107.1 1 197.19 45.54 90.09 44.55 152.15 121.62L616.6 713.45q-7 7-7 17.01 0 10.01 7 17.02t17.01 7.01h358.35q14.01 0 23.02-9.01t9.01-23.02V364.11q0-10.01-7-17.02t-17.01-7.01z"></path></svg>
                                        </span>
                                        <span>Redo</span>
                                    </div>
                                </div>
                                <div class="command" data-command="pasteHere">
                                    <div class="context-menu-index-item">
                                        <span role="img" class="anticon">
                                            <svg id="icon-paste" viewBox="0 0 1024 1024"><path d="M795.99 199.33h-75.02v-62.16h109.31q10.72 0 19.3 8.58 8.57 8.57 8.57 19.29v102.88h-62.16v-68.59zM240.87 898.05h-75.02V199.33h75.02v-62.16H131.56q-10.72 0-19.29 8.58-8.57 8.57-8.57 19.29v760.88q0 10.71 8.57 18.75t19.29 9.11h102.88l6.43-55.73z m411.52-623.7H309.46V137.17h68.58V62.16q1.07-26.8 18.22-43.94Q413.41 1.08 440.2 0.01h75.01q26.8 1.07 43.94 18.21 17.14 17.14 18.22 43.94v75.01h75.02v137.18zM515.21 62.16H440.2v75.01h75.01V62.16z m405.09 938.77V548.69L720.97 342.93H343.75q-16.08 0-25.19 8.57-9.11 8.57-9.11 19.3v623.7q0 10.72 8.57 18.76 8.57 8.04 19.29 9.11H886q15 4.28 24.11-2.68 9.11-6.97 10.18-18.76z m-68.58-438.31H714.54v-151.1l137.18 151.1z m6.43 411.52H371.61V411.52h280.78v212.19h205.76v350.43z" fill="#666666"></path></svg>
                                        </span>
                                        <span>Paste Here</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Form.create()(KoniDetail);