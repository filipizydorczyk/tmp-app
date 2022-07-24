import React from "react";
import { Col, Row } from "react-bootstrap";
import ColorPicker from "@tmp/front/components/ColorPicker";
import deleteIcon from "./delete-svgrepo-com.svg";
import doneIcon from "./done-all-svgrepo-com.svg";
import doneTodayIcon from "./done-today-svgrepo-com.svg";
import undoIcon from "./undo-svgrepo-com.svg";
import undoTodayIcon from "./undo-today-svgrepo-com.svg";

export type TodoListElement = {
    id: string;
    title: string;
    date: Date;
    done: boolean;
    today: boolean;
    color: string;
};

export type TodoListElementActionCallback = (callbackArgs: {
    action: "delete" | "done" | "open" | "today" | "color";
    item: TodoListElement;
}) => void;

export type TodoListProps = {
    items: TodoListElement[];
    onAction?: TodoListElementActionCallback;
    style?: React.CSSProperties;
};

const iconStyle = {
    display: "block",
    width: "1rem",
    cursor: "pointer",
};

function TodoList({ items, onAction = () => {}, style }: TodoListProps) {
    return (
        <Row style={{ ...style, overflowY: "scroll", overflowX: "visible" }}>
            <Col>
                {items.map((item) => (
                    <Row
                        className={`py-3 px-2 mb-1 rounded ${
                            item.done || item.today ? `bg-light` : ``
                        }`}
                        style={{
                            border: "1px solid #ced4da",
                            position: "relative",
                            backgroundColor: item.color,
                        }}
                        key={item.id}
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
                                <ColorPicker
                                    colors={[
                                        "#A4036F",
                                        "#048BA8",
                                        "#16DB93",
                                        "#EFEA5A",
                                        "#F29E4C",
                                    ]}
                                    onColorSelected={(color) => {
                                        onAction({
                                            action: "color",
                                            item: { ...item, color },
                                        });
                                    }}
                                />
                            </Row>
                        </Col>
                        <Col
                            className="d-flex justify-content-center"
                            xs="auto"
                        >
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
                        <Col
                            className="d-flex justify-content-center"
                            xs="auto"
                        >
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
                        <Col
                            className="d-flex justify-content-center"
                            xs="auto"
                        >
                            <img
                                onClick={() =>
                                    onAction({ action: "delete", item })
                                }
                                src={deleteIcon}
                                style={iconStyle}
                            />
                        </Col>
                    </Row>
                ))}
            </Col>
        </Row>
    );
}

export default TodoList;
