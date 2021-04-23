import React, {useState, useEffect, useRef} from "react";
import {Button, Container, Form, MyMessage, MyRow, Page, PartnerMessage, PartnerRow, TextArea} from "./App.styles";
import io from "socket.io-client";


const App = () => {
    const [yourID, setYoyrID] = useState();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    const socketRef = useRef();

    useEffect(() => {
        socketRef.current = io.connect('/');

        socketRef.current.on('your id', id => {
            setYoyrID(id);
        })

        socketRef.current.on('message', (message) => {
            console.log('here')
            receivedMessage(message)
        })

    }, []);

    const receivedMessage = (message) => {
        setMessages(oldMsgs => [...oldMsgs, message]);
    }

    const sendMessage = (e) => {
        e.preventDefault();
        const messageObject = {
            body: message,
            id: yourID
        };

        setMessage('');
        socketRef.current.emit('send message', messageObject)
    }

    const handleChange = (e) => {
        setMessage(e.target.value)
    }
    return (
        <Page>
            <Container>
                {messages.map((message, index) => {
                    if (message.id === yourID) {
                        return (
                            <MyRow key={index}>
                                <MyMessage>
                                    {message.body}
                                </MyMessage>
                            </MyRow>
                        )
                    }
                    return (
                        <PartnerRow key={index}>
                            <PartnerMessage>
                                {message.body}
                            </PartnerMessage>
                        </PartnerRow>
                    )
                })}
            </Container>
            <Form onSubmit={sendMessage}>
                <TextArea
                    value={message}
                    onChange={handleChange}
                    placeholder={'Say something...'} />
                <Button>send</Button>
            </Form>
        </Page>
    )
}

export default App;