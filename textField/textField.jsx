import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import Input from '@material-ui/core/Input'

import defaultColors from '../js/defaultColors'

const navigateur = 'User-agent header sent: ' + navigator.userAgent
const flag = (navigateur.indexOf('Firefox') > -1 ? 1 : 0)

const styles = {
  formControl: {
    width: '100%',
  },
  textField: {
    border: '0.5px solid ' + defaultColors.defaultTextColor,
    height: 45,
    borderRadius: 25,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: '5px !important',
  },
  textFieldError: {
    border: '1.5px solid ' + defaultColors.errorColor,
  },
  error: {
    color: defaultColors.errorColor,
    fontSize: '0.9em',
    fontWeight: 'bold',
    fontFamily: '"Poppins", sans-serif',
    marginTop: 6,
  },
}

/**
 * TextField d'une page.
 *
 * @param {string} [title] - Titre du TextField
 * @param {string} value - Contenu du TextField
 * @param {func} [onChange] - Récuperation nouvelle valeur du textField apres changement
 * @param {string} [placeholder] - Placeholder
 * @param {bool} [required=false] - true si le champ est obligatoire
 * @param {bool} [checkValidity=false] - true si le champ doit être vérifié
 * @param {func} [validate] - Fonction appelée pour vérifier la valeur du champ
 * @param {string} [requiredMessage] - Message affiché si le champ est obligatoire et vide
 * @param {string} [invalidMessage] - Message affiché si le champ est invalide
 * @param {bool} [disabled=false] - true si le champ est inactif
 */

class BtuTextField extends Component {
  state = {
    stateInputId: '',
    stateValue: '',
  }

  componentDidMount() {
    this.setState({ stateInputId: 'btu-input-' + Math.round(Math.random() * 1000000) })
  }

  componentWillReceiveProps(props) {
    if (props.value !== undefined) {
      const newState = this.state
      newState.stateValue = props.value
      this.setState(newState)
    }
  }

  handleChange = (newVal, inputType) => {
    const { onChange } = this.props
    let checkedVal = newVal
    if (inputType === 'number') {
      checkedVal = newVal.replace(/\D/g, '')
    }
    this.setState({ stateValue: checkedVal })
    onChange({
      value: checkedVal,
      isValid: this.validateValue(checkedVal),
    })
  }

  validateValue = (value) => {
    const { required, validate } = this.props
    if (required && value === '') {
      return false
    }
    return validate(value)
  }

  addZero = (nbChiffres, value) => {
    const logValue = Math.round(Math.log10(value))
    let str = value.toString()
    for (let i = 0; i < nbChiffres - logValue; i++) {
      str = '0' + str
    }

    return str
  }

  render() {
    const {
      classes,
      inputId,
      title,
      inputType,
      value,
      placeholder,
      disabled,
      required,
      checkValidity,
      validate,
      requiredMessage,
      invalidMessage,
      maxLength,
    } = this.props

    const {
      stateInputId,
      stateValue,
    } = this.state

    return (
      <FormControl className={classes.formControl}>
        <FormLabel htmlFor={inputId !== null ? inputId : stateInputId} style={{ width: flag ? ' -moz-max-content' : 'max-content' }}>
          {title}
        </FormLabel>
        <Input
          id={inputId !== null ? inputId : stateInputId}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={newVal => this.handleChange(newVal.target.value, inputType)}
          onInput={(e) => {
            e.target.value = (inputType === 'number') ? (e.target.value).toString().slice(0, maxLength)
            : e.target.value
          }}
          className={classNames({
            [classes.textField]: true,
            [classes.textFieldError]: required && checkValidity && ((!stateValue || stateValue === '') || (checkValidity && !validate(stateValue))),
          })}
          disableUnderline
        />
        { required && checkValidity
        && (
          (!stateValue || stateValue === '')
          ? <div className={classes.error}>{requiredMessage}</div>
          : (checkValidity && !validate(stateValue))
            && (
              <div className={classes.error}>{invalidMessage}</div>
            )
          )
        }
      </FormControl>
    )
  }
}

/**
 *
 * Types et valeurs par défaut des props
 *
 */

BtuTextField.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  inputId: PropTypes.string,
  title: PropTypes.string,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  checkValidity: PropTypes.bool,
  validate: PropTypes.func,
  requiredMessage: PropTypes.string,
  invalidMessage: PropTypes.string,
  inputType: PropTypes.string,
  maxLength: PropTypes.number,
}

BtuTextField.defaultProps = {
  inputId: null,
  title: '',
  value: null,
  disabled: false,
  onChange: () => (null),
  placeholder: '',
  required: false,
  checkValidity: false,
  validate: () => true,
  requiredMessage: '',
  invalidMessage: '',
  inputType: 'text',
  maxLength: 1000,
}

export default withStyles(styles)(BtuTextField)
