import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class QuestionsForm extends Component {
  constructor(props) {
    super(props);
    this.state = { title: '', body: '' };
    this.onInputChange = this.onInputChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  onSubmit(event) {
  	event.preventDefault();
    this.props.onSubmit(this.state);
  }

  render() {
    return (
		<div>
		  <form onSubmit={this.onSubmit}>
		    <label htmlFor="title">
		      <span>Asunto</span>
		      <input 
			      type="text" 
			      name="title" 
			      value={this.state.title}
			      onChange={this.onInputChange}
		      />
		    </label>

		    <label htmlFor="body">
		      <span>Cuerpo de la respuesta</span>
		      <textarea 
			      type="text" 
			      name="body" 
			      value={this.state.body}
			      onChange={this.onInputChange}
		      >
		      </textarea>
			</label>

		    <div className="actions">
          		<input type="submit" value="Contestar" />
        	</div>
		  </form>
		</div>
    );
  }
}

QuestionsForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}