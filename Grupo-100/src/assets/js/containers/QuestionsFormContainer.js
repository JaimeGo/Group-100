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
  }

  componentDidMount() {
    this.fetchAnswerForm();
  }

  async onSubmit(data) {
    this.setState({ loading: true, error: undefined, showThanks: false });
    try {
      const json =
        await answerForm.createAnswer(this.props.questionId)
      this.setState({loading: false, showThanks: true });
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  }

  async fetchAnswerForm() {
    this.setState({ loading: true });
    const answerForm = 
      await answerService.newAnswer(this.props.questionId);
    this.setState({loading: false });
  }

  render() {
    if (this.state.loading) {
      return <p>Loading...</p>;
    }
    return (
      <div>

      </div>
    );
  }
}

QuestionsFormContainer.propTypes = {
  ongId: PropTypes.string.isRequired,
  initiativeId: PropTypes.string.isRequired,
};