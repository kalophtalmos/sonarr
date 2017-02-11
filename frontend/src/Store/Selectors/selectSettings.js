import _ from 'lodash';

function getValidationFailures(saveError) {
  if (!saveError || saveError.status !== 400) {
    return [];
  }

  return _.cloneDeep(saveError.responseJSON);
}

function selectSettings(item, pendingChanges, saveError) {
  const validationFailures = getValidationFailures(saveError);

  const settings = _.reduce(item, (result, value, key) => {
    if (key === 'fields') {
      return result;
    }

    const setting = {
      value,
      errors: _.map(_.remove(validationFailures, (failure) => {
        return failure.propertyName.toLowerCase() === key.toLowerCase() && !failure.isWarning;
      }), (failure) => failure.errorMessage),

      warnings: _.map(_.remove(validationFailures, (failure) => {
        return failure.propertyName.toLowerCase() === key.toLowerCase() && failure.isWarning;
      }), (failure) => failure.errorMessage)
    };

    if (pendingChanges.hasOwnProperty(key)) {
      setting.previousValue = setting.value;
      setting.value = pendingChanges[key];
      setting.pending = true;
    }

    result[key] = setting;
    return result;
  }, {});

  const fields = _.reduce(item.fields, (result, f) => {
    const field = Object.assign({ pending: false }, f);
    const hasPendingFieldChange = pendingChanges.fields && pendingChanges.fields.hasOwnProperty(field.name);

    if (hasPendingFieldChange) {
      field.previousValue = field.value;
      field.value = pendingChanges.fields[field.name];
      field.pending = true;
    }

    field.errors = _.map(_.remove(validationFailures, (failure) => {
      return failure.propertyName.toLowerCase() === field.name.toLowerCase() && !failure.isWarning;
    }), (failure) => failure.errorMessage);

    field.warnings = _.map(_.remove(validationFailures, (failure) => {
      return failure.propertyName.toLowerCase() === field.name.toLowerCase() && failure.isWarning;
    }), (failure) => failure.errorMessage);

    result.push(field);
    return result;
  }, []);

  if (fields.length) {
    settings.fields = fields;
  }

  const validationErrors = _.filter(validationFailures, (failure) => {
    return !failure.isWarning;
  });

  const validationWarnings = _.filter(validationFailures, (failure) => {
    return failure.isWarning;
  });

  return {
    settings,
    validationErrors,
    validationWarnings,
    hasPendingChanges: !_.isEmpty(pendingChanges),
    hasSettings: !_.isEmpty(settings),
    pendingChanges
  };
}

export default selectSettings;
