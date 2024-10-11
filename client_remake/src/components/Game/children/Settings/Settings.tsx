import styles from "./Settings.module.scss";
import { useForm } from "@tanstack/react-form";
import {
  type T_GAME_SETTINGS,
  E_GAME_LIMIT_TYPES,
  E_GAME_STATUS,
} from "../../../../types/game";
import Locals, { type T_SETTINGS_FORM } from "./Locals";
import { deepCopyObject } from "../../../../utils/methods";
import { FaClock, FaQuestionCircle } from "react-icons/fa";

interface IProps {
  gameSettings: React.MutableRefObject<T_GAME_SETTINGS>;
  setGameStatus: React.Dispatch<React.SetStateAction<E_GAME_STATUS>>;
  setLimitType: React.Dispatch<React.SetStateAction<E_GAME_LIMIT_TYPES>>;
  timeInSeconds: {
    set: React.Dispatch<React.SetStateAction<number>>;
  };
}

const Settings: React.FC<IProps> = (props) => {
  const form = useForm<T_SETTINGS_FORM>({
    defaultValues: {
      ...deepCopyObject(Locals.INIT_SETTINGS_FORM),
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
      const obj: T_GAME_SETTINGS = {
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
          time: value.limits.type,
          count: Number.parseInt(value.limits.count as string) | 0,
        },
      };

      if (value.limits.type === E_GAME_LIMIT_TYPES.TIME) obj.limits.count = 0;
      else obj.limits.time = 0;

      props.gameSettings.current = obj;
      props.setGameStatus(E_GAME_STATUS.ACTIVE);
      props.setLimitType(
        value.limits.type === E_GAME_LIMIT_TYPES.TIME
          ? E_GAME_LIMIT_TYPES.TIME
          : E_GAME_LIMIT_TYPES.COUNT,
      );
      props.timeInSeconds.set(
        value.limits.type === E_GAME_LIMIT_TYPES.TIME ? obj.limits.count : 0,
      );
    },
  });
  const formErrorMap = form.useStore((state) => state.errorMap);

  return (
    <div className={styles.root}>
      <div className={styles.scroll}>
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
                      placeholder="Min"
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
            <div className={styles.div}>-</div>
            <div className={styles.max}>
              <form.Field
                name="range.max"
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
                      placeholder="Max"
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
                  <div
                    onClick={() => {
                      field.setValue(!field.getValue());
                    }}
                    className={
                      field.getValue() ? styles.checked : styles.unchecked
                    }
                  >
                    &#x002B;
                  </div>
                )}
              />
            </div>
            <div className={styles.sub}>
              <form.Field
                name="ops.sub"
                children={(field) => (
                  <div
                    onClick={() => {
                      field.setValue(!field.getValue());
                    }}
                    className={
                      field.getValue() ? styles.checked : styles.unchecked
                    }
                  >
                    &minus;
                  </div>
                )}
              />
            </div>
            <div className={styles.mult}>
              <form.Field
                name="ops.mult"
                children={(field) => (
                  <div
                    onClick={() => {
                      field.setValue(!field.getValue());
                    }}
                    className={
                      field.getValue() ? styles.checked : styles.unchecked
                    }
                  >
                    &times;
                  </div>
                )}
              />
            </div>
            <div className={styles.div}>
              <form.Field
                name="ops.div"
                children={(field) => (
                  <div
                    onClick={() => {
                      field.setValue(!field.getValue());
                    }}
                    className={
                      field.getValue() ? styles.checked : styles.unchecked
                    }
                  >
                    &divide;
                  </div>
                )}
              />
            </div>
          </div>
          {formErrorMap.onSubmit !== undefined && (
            <div className={styles.ops_error}>{formErrorMap.onSubmit}</div>
          )}

          <form.Field
            name="limits.type"
            children={(field) => (
              <div className={styles.limits}>
                <div
                  className={`${styles.time} ${field.getValue() === E_GAME_LIMIT_TYPES.TIME ? styles.checked : styles.unchecked}`}
                  onClick={() => {
                    field.setValue(E_GAME_LIMIT_TYPES.TIME);
                    console.log(field.getValue());
                  }}
                >
                  <FaClock />
                </div>

                <div
                  className={`${styles.questions} ${field.getValue() === E_GAME_LIMIT_TYPES.COUNT ? styles.checked : styles.unchecked}`}
                  onClick={() => {
                    field.setValue(E_GAME_LIMIT_TYPES.COUNT);
                    console.log(field.getValue());
                  }}
                >
                  <FaQuestionCircle />
                </div>
              </div>
            )}
          />

          <button type="submit">Start</button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
