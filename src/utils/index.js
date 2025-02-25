import { DURATION } from "../const";

export const getRangeByDuration = (duration) => {
  switch (duration) {
    case DURATION.DAY:
      return "За день";
    case DURATION.WEEK:
      return "За неделю";
    case DURATION.MONTH:
      return "За месяц";
  }
};
