
import CreateRoomForGovernmentComponent from "../../components/CreateRoomForGovernmentComponent";
import EditRoomForGovernment from "../../components/EditRoomForGovernment";
import styles from './style.module.css';
export default function CreateRoomForGovernment() {
    return (
        <div className={styles.container}>
            <h1>Создать комнату</h1>
            <CreateRoomForGovernmentComponent />
            <EditRoomForGovernment/>
        </div>
    )
}