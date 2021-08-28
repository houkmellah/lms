import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import InstructorRoute from '../../../../components/routes/InstructorRoute'
import axios from 'axios'
import { Avatar, Button, Tooltip , Modal, Upload } from 'antd'
import { EditOutlined, CheckOutlined, UploadOutlined, ConsoleSqlOutlined } from '@ant-design/icons'
import ReactMarkdown from 'react-markdown'
import AddLessonForm from '../../../../components/forms/AddLessonForm'
import {toast} from "react-toastify"

const CourseView = () => {
    const [course, setCourse] = useState({})
    //for lessons 
    const [visible, setVisible] = useState(false)
    const [progress, setProgress] = useState(0)
    
    const [values, setValues] = useState({
        title: '',
        content: '',
        video: {},
    })
    const [uploading, setUploading] = useState(false)
    const [uploadButtonText, setUploadButtonText] = useState("Upload Video")
    const router = useRouter()
    const { slug } = router.query

    useEffect(() => { loadCourse() }, [slug])
    
    const loadCourse = async () => {
        const { data } = await axios.get(`/api/course/${slug}`)
        setCourse(data)
    }
    //Fuctions for ADD LESSONS 
    const handleAddLesson = e => {
        e.preventDefault()
        console.log(values)
    }

    const handleVideo = async(e) => {
        
        try {
            const file = e.target.files[0]
            setUploadButtonText(file.name)
            setUploading(true)
            
            
            const videoData = new FormData()
            videoData.append("video", file)
            // save progress bar and send video as form data to backend 
            const { data } = await axios.post('/api/course/video-upload', videoData, {
                onUploadProgress: (e) => {
                    setProgress(Math.round((100 * e.loaded) / e.total))
                }
            })
        // once response is receive
            console.log(data)
            setValues({ ...values, video: data })
            setUploading(false)
        } catch (err) {
            console.log(err)
            setUploading(false)
            toast("Vidéo upload failed")
        }
    }

    const handleVideoRemove = async () => {
        try {
            setUploading(true)
            const { data } = await axios.post('api/course/remove-video', values.video)
            console.log(data)
            setValues({ ...values, video: {} })
            setUploading(false)
            setUploadButtonText("Upload another video")
            
        }catch(err){
            console.log(err)
            setUploading(false)
            toast("Vidéo remove failed")
        }
    }

    return (
        <InstructorRoute>
            <div className="container-fluid pt-3">
                {/* <pre>{JSON.stringify(course, null, 4)}</pre> */}
                {course &&
                    <div className="media pt-2">
                    <Avatar size={80} src={course.image ? course.image.Location : '/course.png'} />
                        <div className="media-body pl-2">
                            <div className="row">
                                <div className="col">
                                    <h5 className="mt-2 text-primary">{course.name}</h5>
                                    <p style={{marginTop:"-10px"}}>{course.lessons && course.lessons.length} Lessons</p>
                                    <p style={{marginTop:"-15px", fontSize:"10px"}}>{course.category}</p>                                                                    
                                </div>    
                            </div>
                            <div className="d-flex pt-4">
                                <Tooltip title="Edit">
                                    <EditOutlined className="h5 pointer text-warning" />
                                </Tooltip>
                                <Tooltip title="Publish">
                                    <CheckOutlined className="h5 pointer text-danger" />
                                </Tooltip>
                            </div>                        
                        </div>
                        
                        <div className="row">
                            <div className="col">
                                <ReactMarkdown source={course.description} />
                            </div>
                    </div>
                    <div className="row">
                        <Button
                            onClick={() => setVisible(true)}
                            className="col-md-6 offset-md-3 text-center"
                            type="primary"
                            shape="round"
                            icon={<UploadOutlined />}
                            size="large" >
                    Add lesson
                    </Button>
                    </div>
                    <br />
                    <Modal title="+ Add lesson"
                        centered
                        visible={visible}
                        onCancel={() => setVisible(false)}
                        footer={null}
                    >
                        <AddLessonForm
                            values={values}
                            setValues={setValues}
                            handleAddLesson={handleAddLesson}
                            uploading={uploading}
                            uploadButtonText={uploadButtonText}
                            handleVideo={handleVideo}
                            progress={progress}
                            handleVideoRemove={handleVideoRemove}
                        />
                    </Modal>
                    </div>

                
                }

            </div>
        </InstructorRoute>
    )
}

export default CourseView