import { Col, Row } from "react-bootstrap";
import ColorPicker from "@tmp/front/components/ColorPicker";
import deleteIcon from "./delete-svgrepo-com.svg";
import doneIcon from "./done-all-svgrepo-com.svg";
import doneTodayIcon from "./done-today-svgrepo-com.svg";
import undoIcon from "./undo-svgrepo-com.svg";
import undoTodayIcon from "./undo-today-svgrepo-com.svg";

export type TodoListElementActionCallback = (callbackArgs: {
    action: "delete" | "done" | "open" | "today" | "color";
    item: TodoListElement;
}) => void;

type TodoItemProps = {
    item: TodoListElement;
    onAction?: TodoListElementActionCallback;
};

export type TodoListElement = {
    id: string;
    title: string;
    date: Date;
    done: boolean;
    today: boolean;
    color: string;
};

const iconStyle = {
    display: "block",
    width: "1rem",
    cursor: "pointer",
};

function TodoItem({ item, onAction = () => {} }: TodoItemProps) {
    const displayColorBorder =
        item.color && item.color != "#ffffff" && !item.done && !item.today;

    const itemStyle: React.CSSProperties = {
        border: "1px solid #ced4da",
        position: "relative",
        backgroundColor: "#ffffff",
        borderLeft: displayColorBorder
            ? `5px solid ${item.color}`
            : `1px solid rgb(206, 212, 218)`,
    };

    return (
        <Row
            className={`py-3 px-2 mb-1 rounded ${
                item.done || item.today ? `bg-light` : ``
            }`}
            style={itemStyle}
        >
            <Col>
                <Row>
                    <p
                        className={`mb-0 ${
                            item.done || item.today
                                ? `text-secondary text-decoration-line-through`
                                : `text-dark`
                        }`}
                    >
                        {item.title}
                    </p>
                </Row>
                <Row>
                    {!item.done && !item.today && (
                        <ColorPicker
                            colors={[
                                "#aa76ff",
                                "#ff68d5",
                                "#ff76a2",
                                "#ff9f74",
                                "#ffcd5e",
                                "#f9f871",
                            ]}
                            onColorSelected={(color) => {
                                onAction({
                                    action: "color",
                                    item: { ...item, color },
                                });
                            }}
                        />
                    )}
                </Row>
            </Col>
            <Col className="d-flex justify-content-center" xs="auto">
                <img
                    onClick={() =>
                        onAction({
                            action: item.today ? "open" : "today",
                            item,
                        })
                    }
                    src={item.today ? undoTodayIcon : doneTodayIcon}
                    style={iconStyle}
                />
            </Col>
            <Col className="d-flex justify-content-center" xs="auto">
                <img
                    onClick={() =>
                        onAction({
                            action: item.done ? "open" : "done",
                            item,
                        })
                    }
                    src={item.done ? undoIcon : doneIcon}
                    style={iconStyle}
                />
            </Col>
            <Col className="d-flex justify-content-center" xs="auto">
                <img
                    onClick={() => onAction({ action: "delete", item })}
                    src={deleteIcon}
                    style={iconStyle}
                />
            </Col>
        </Row>
    );
}

export default TodoItem;
