import React, { Component } from 'react';
import PropTypes from 'prop-types';
import QuestionsFormComponent from '../components/QuestionsForm';
import answersService from '../services/answers';

export default class QuestionsFormContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: undefined,
      showThanks: false,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.fetchAnswerForm = this.fetchAnswerForm.bind(this)
  }

  async onSubmit(data) {
    this.setState({ loading: true, error: undefined, showThanks: false });
    try {
      const json =
        await answerService.createAnswer(this.props.questionId)
      this.setState({loading: false, showThanks: true });
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  }

  render() {
    if (this.state.loading) {
      return (
      <div> Loading...</div>
    )
    }
    return (
      <div>
        <QuestionsFormComponent
          onSubmit={this.onSubmit}
        />
      </div>
    );
  }
}

QuestionsFormContainer.propTypes = {
  questionId: PropTypes.string.isRequired,
};
