/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const questions = require( "./questions.json" ).map( function( _question ){
	for( var i=0; i<_question.answers.length; i++ ){
		if( _question.answers[i].letter == _question.answer ){
			_question.answers[i].correct = true;
		}else{
			_question.answers[i].correct = false;
		}
	}

	return _question;
} );

import {
	Container,
	Header,
	Content,
	ListItem,
	Text,
	Radio,
	Right,
	Left,
	Icon,
	Card,
	CardItem,
	Button,
} from 'native-base';

function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len;
    }
    return result;
}

class Quiz extends Component {

	constructor(props){
		super(props);
		const _questions = getRandom( questions, this.props.numQuestions );
		this.state = {
			availableQuestions: questions,
			questionsToUse: _questions,
			currentQuestionIndex: 0,
			currentQuestion: _questions[0],
			correctQuestionIndexs: [ ],
			incorrectQuestionIndexs: [ ],
			incorrectQuestionCount: 0,
			showQuestionAnswer: false
		}
	}
	answerQuestion(i) {
		this.setState( {
			selectedQuestion: i,
			showQuestionAnswer: true,
		} );

		if( this.state.currentQuestion.answer !== this.state.currentQuestion.answers[i].letter ){
			this.setState( {
				incorrectQuestionCount: this.state.incorrectQuestionCount+1
			} );
			this.props.onIncorrectQuestion( );
		}
	}

	nextQuestion(){

		// If we're done the quiz
		if( this.state.currentQuestionIndex+1 == this.state.questionsToUse.length ){
			this.props.onDone( {
				incorrectCount: this.state.incorrectQuestionCount,
				totalQuestionCount: this.props.numQuestions
			} );
			return;
		}

		this.props.nextQuestion();
		this.setState( {
			currentQuestionIndex: this.state.currentQuestionIndex+1,
			currentQuestion: this.state.questionsToUse[this.state.currentQuestionIndex+1],
			showQuestionAnswer: false,
		} );
	}

	resetQuiz(){
		const _questions = getRandom( questions, this.props.numQuestions );
		this.setState( {
			questionsToUse: _questions,
			currentQuestionIndex: 0,
			currentQuestion: _questions[0],
			correctQuestionIndexs: [ ],
			incorrectQuestionIndexs: [ ],
			showQuestionAnswer: false,
			incorrectQuestionCount: 0,
		} );
		this.props.onReset();
	}

	componentDidUpdate( newProps ){
		if( newProps.shouldResetQuiz ){
			this.resetQuiz();
		}
	}

	render() {
		let { currentQuestion, selectedQuestion, showQuestionAnswer } = this.state;

		const answerQuestion = (i) => {
			this.answerQuestion(i);
		};

		const nextQuestion = () => {
			this.nextQuestion();
		};

		return (
			<View
				style={{
					padding: 20
				}}
			>
				<Question
					questionId={currentQuestion.questionId}
					questionText={currentQuestion.questionText}
					answers={currentQuestion.answers}
					answer={currentQuestion.answer}
					answerQuestion={answerQuestion}
					showQuestionAnswer={showQuestionAnswer}
					selectedQuestion={selectedQuestion}
				/>
				<Text></Text>
				{showQuestionAnswer && <Button block info onPress={nextQuestion}>
					<Text>Next</Text>
				</Button> }
			</View>
		)
	}
}

class AnswerList extends Component {
	render() {
		const { answerQuestion, showQuestionAnswer, selectedQuestion } = this.props;
		return (
			this.props.answers.map( function( _answer, i ){
				return (
					<Button transparent dark full
						onPress={() => {
							if( !showQuestionAnswer ){
								answerQuestion(i);
							}
						}}
						key={i}
						style={{marginVertical: 15}}
					>
						<View style={{flex: 1, flexDirection: "row", padding: 5}}>
							<Left>
								<Text>{_answer.letter} - {_answer.text}</Text>
							</Left>
							{showQuestionAnswer && _answer.correct && 
								<Icon name="checkmark" style={{ color: "green" , fontSize: 50 }} />
							}
							{showQuestionAnswer && selectedQuestion == i && !_answer.correct &&
								<Icon name="close" style={{ color:"red", fontSize: 50}} />
							}
						</View>
					</Button>
				);
			} )
		)
	}
}
class Question extends Component {
	render() {
		return (
		<View style={{flex: 1, flexDirection: "column", height: "80%"}}>
			<Text>{this.props.questionText}</Text>
			<Text> </Text>
			<AnswerList
				answers={this.props.answers}
				answer={this.props.answer}
				answerQuestion={this.props.answerQuestion}
				showQuestionAnswer={this.props.showQuestionAnswer}
				selectedQuestion={this.props.selectedQuestion}
			/>
		</View>);
	}
}

export default class App extends Component<{}> {
	constructor(props) {
		super(props);
		
		this.state = {
			quizMode: true,
			questionIndex: 1,
			numQuizQuestions: 50,
			incorrectQuestionCount: 0,
			smallHeaderSize: 12,
			shouldResetQuiz: false,
		};
	}

	onQuizReset( ) {
		this.setState( {
			questionIndex: 1,
			numQuizQuestions: 50,
			incorrectQuestionCount: 0,
			shouldResetQuiz: false,
		} );
	}

	resetQuiz( ){
		this.setState( {
			shouldResetQuiz: true,
			showQuizDone: false,
			questionIndex: 1,
			incorrectQuestionCount: 0
		} );
	}

	nextQuestion( ) {
		this.setState( {
			questionIndex: this.state.questionIndex+1
		} );
	}

	onIncorrectQuestion( ) {
		this.setState( {
			incorrectQuestionCount: this.state.incorrectQuestionCount+1
		} );
	}

	onQuizDone( o ) {
		
		this.setState( {
			showQuizDone: true,
			correctCount: o.totalQuestionCount - o.incorrectCount,
			incorrectCount: o.incorrectCount,
			questionCount: o.totalQuestionCount
		} );
	}

	render() {
		const {
			smallHeaderSize,
			questionIndex,
			quizMode,
			numQuizQuestions,
			shouldResetQuiz,
			incorrectQuestionCount,
			correctCount,
			incorrectCount,
			questionCount,
			showQuizDone,
		} = this.state;

		const onQuizReset = ( ) => {
			this.onQuizReset();
		};

		const nextQuestion = ( ) => {
			this.nextQuestion();
		};

		const resetQuiz = ( ) => {
			this.resetQuiz();
		};

		const onIncorrectQuestion = ( ) => {
			this.onIncorrectQuestion( );
		};

		const onQuizDone = ( o ) => {
			this.onQuizDone( o );
		};

		    return (
		      <Container>
			<Header>
				<Left>
					<Text>Flashcards</Text>
					{ quizMode && <Text style={{fontSize: smallHeaderSize}}>
						{questionIndex}/{numQuizQuestions}
						&nbsp;	{ incorrectQuestionCount !== 0 &&
								<Text style={{ fontSize: smallHeaderSize, color: "red"}}>{incorrectQuestionCount}</Text>
							}
					</Text> }
				</Left>
				<Right>
					<Icon name='refresh' onPress={resetQuiz}/>
				</Right>
			</Header>
			<Content>
				{ !showQuizDone && 
				<Quiz
					style={{flex:1}}
					questionIndex={questionIndex}
					onIncorrectQuestion={onIncorrectQuestion}
					numQuestions={numQuizQuestions}
					nextQuestion={nextQuestion}
					shouldResetQuiz={shouldResetQuiz}
					onReset={onQuizReset}
					onDone={onQuizDone}
				/>}
				{showQuizDone &&
					<View style={{
						flex: 1,
						alignItems: "center",
						justifyContent: "center"
					}}>
						<Text>You got {correctCount} out of {questionCount}</Text>
						{ ( correctCount / questionCount ) >= 0.7 &&
							 <Icon name="happy" style={{ fontSize: 80 }}/>
						}
						{ ( correctCount / questionCount ) < 0.7 &&
							<Icon name="sad" style={{ fontSize: 80 }} />
						}
						<Button block info onPress={resetQuiz}><Text>Go Again</Text></Button>
					</View>
				}
			</Content>
		      </Container>
		    );
	}
}
