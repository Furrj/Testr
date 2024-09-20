import styles from "./Game.module.scss";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";

type T_GAME_SETTINGS = {
  range: {
    min: number | string;
    max: number | string;
  };
  ops: {
    add: boolean;
    sub: boolean;
    mult: boolean;
    div: boolean;
  };
  limits: {
    time: number | string;
    count: number | string;
  };
};
const INIT_GAME_SETTINGS: T_GAME_SETTINGS = {
  range: {
    min: "",
    max: "",
  },
  ops: {
    add: false,
    sub: false,
    mult: false,
    div: false,
  },
  limits: {
    time: "",
    count: "",
  },
};

const Game: React.FC = () => {
  const [timeLimit, setTimeLimit] = useState<boolean>(true);

  const form = useForm<T_GAME_SETTINGS>({
    defaultValues: {
      ...INIT_GAME_SETTINGS,
    },
    validators: {
      onSubmit({ value }) {
        return !value.ops.add &&
          !value.ops.sub &&
          !value.ops.mult &&
          !value.ops.div
          ? "Choose at least one operation"
          : undefined;
      },
    },
    onSubmit: ({ value }) => {
      const obj = {
        range: {
          min: Number.parseInt(value.range.min as string) | 0,
          max: Number.parseInt(value.range.max as string) | 0,
        },
        ops: {
          add: value.ops.add,
          sub: value.ops.sub,
          mult: value.ops.mult,
          div: value.ops.div,
        },
        limits: {
          time: Number.parseInt(value.limits.time as string) | 0,
          count: Number.parseInt(value.limits.count as string) | 0,
        },
      };

      if (timeLimit) obj.limits.count = 0;
      else obj.limits.time = 0;

      console.log(obj);
    },
  });
  const formErrorMap = form.useStore((state) => state.errorMap);

  return (
    <div className={styles.root}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className={styles.range}>
          <div className={styles.min}>
            <form.Field
              name="range.min"
              children={(field) => (
                <>
                  <h2>Min</h2>
                  <input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={
                      field.state.meta.errors.length > 0 ? styles.errInput : ""
                    }
                    type="number"
                  />
                  {field.state.meta.errors.length > 0 ? (
                    <div className={styles.err}>
                      {field.state.meta.errors.join(", ")}
                    </div>
                  ) : null}
                </>
              )}
              validators={{
                onChange: ({ value, fieldApi }) => {
                  if (
                    !Number.isNaN(value) &&
                    !Number.isNaN(fieldApi.form.getFieldValue("range.max")) &&
                    Number.parseInt(value as string) >=
                      Number.parseInt(
                        fieldApi.form.getFieldValue("range.max") as string,
                      )
                  ) {
                    return "Min must be less than max";
                  }

                  return undefined;
                },
                onSubmit: ({ value }) => {
                  if (value === "") {
                    return "Cannot be empty";
                  } else if (Number.isNaN(value as string)) {
                    return "Invalid value";
                  }

                  return undefined;
                },
              }}
            />
          </div>
          <div className={styles.max}>
            <form.Field
              name="range.max"
              children={(field) => (
                <>
                  <h2>Max</h2>
                  <input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={
                      field.state.meta.errors.length > 0 ? styles.errInput : ""
                    }
                    type="number"
                  />
                  {field.state.meta.errors.length > 0 ? (
                    <div className={styles.err}>
                      {field.state.meta.errors.join(", ")}
                    </div>
                  ) : null}
                </>
              )}
              validators={{
                onChange: ({ value, fieldApi }) => {
                  if (
                    !Number.isNaN(value) &&
                    !Number.isNaN(fieldApi.form.getFieldValue("range.min")) &&
                    Number.parseInt(value as string) <=
                      Number.parseInt(
                        fieldApi.form.getFieldValue("range.min") as string,
                      )
                  ) {
                    return "Max must be more than min";
                  }

                  return undefined;
                },
                onSubmit: ({ value }) => {
                  if (value === "") {
                    return "Cannot be empty";
                  } else if (Number.isNaN(value as string)) {
                    return "Invalid value";
                  }

                  return undefined;
                },
              }}
            />
          </div>
        </div>
        <div className={styles.ops}>
          <div className={styles.add}>
            <form.Field
              name="ops.add"
              children={(field) => (
                <>
                  <h2>&#x002B;</h2>
                  <input
                    type="checkbox"
                    name={field.name}
                    checked={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.checked)}
                  />
                </>
              )}
            />
          </div>
          <div className={styles.sub}>
            <form.Field
              name="ops.sub"
              children={(field) => (
                <>
                  <h2>&minus;</h2>
                  <input
                    type="checkbox"
                    name={field.name}
                    checked={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.checked)}
                  />
                </>
              )}
            />
          </div>
          <div className={styles.mult}>
            <form.Field
              name="ops.mult"
              children={(field) => (
                <>
                  <h2>&times;</h2>
                  <input
                    type="checkbox"
                    name={field.name}
                    checked={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.checked)}
                  />
                </>
              )}
            />
          </div>
          <div className={styles.div}>
            <form.Field
              name="ops.div"
              children={(field) => (
                <>
                  <h2>&divide;</h2>
                  <input
                    type="checkbox"
                    name={field.name}
                    checked={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.checked)}
                  />
                </>
              )}
            />
          </div>
        </div>
        {formErrorMap.onSubmit !== undefined && (
          <div className={styles.ops_error}>{formErrorMap.onSubmit}</div>
        )}
        <div className={styles.limits}>
          <div className={styles.time}>
            <h2>Time Limit (s)</h2>
            <input
              type="checkbox"
              name="time_limit_check"
              checked={timeLimit}
              onChange={() => setTimeLimit((c) => !c && true)}
            />
            {timeLimit && (
              <form.Field
                name="limits.time"
                children={(field) => (
                  <>
                    <input
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className={
                        field.state.meta.errors.length > 0
                          ? styles.errInput
                          : ""
                      }
                      type="number"
                    />
                    {field.state.meta.errors.length > 0 ? (
                      <div className={styles.err}>
                        {field.state.meta.errors.join(", ")}
                      </div>
                    ) : null}
                  </>
                )}
                validators={{
                  onChange: ({ value }) => {
                    if (Number.parseInt(value as string) < 0) {
                      return "Cannot be negative";
                    }

                    return undefined;
                  },
                  onSubmit: ({ value }) => {
                    if (
                      timeLimit &&
                      (value === "" || Number.isNaN(value as string))
                    ) {
                      return "Cannot be empty";
                    }

                    return undefined;
                  },
                }}
              />
            )}
          </div>
          <div className={styles.questions}>
            <h2>Question Limit</h2>
            <input
              type="checkbox"
              name="question_limit_check"
              checked={!timeLimit}
              onChange={() => setTimeLimit((c) => c && false)}
            />
            {!timeLimit && (
              <form.Field
                name="limits.count"
                children={(field) => (
                  <>
                    <input
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className={
                        field.state.meta.errors.length > 0
                          ? styles.errInput
                          : ""
                      }
                      type="number"
                    />
                    {field.state.meta.errors.length > 0 ? (
                      <div className={styles.err}>
                        {field.state.meta.errors.join(", ")}
                      </div>
                    ) : null}
                  </>
                )}
                validators={{
                  onChange: ({ value }) => {
                    if (Number.parseInt(value as string) < 0) {
                      return "Cannot be negative";
                    }

                    return undefined;
                  },
                  onSubmit: ({ value }) => {
                    if (
                      !timeLimit &&
                      (value === "" || Number.isNaN(value as string))
                    ) {
                      return "Cannot be empty";
                    }

                    return undefined;
                  },
                }}
              />
            )}
          </div>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Game;
