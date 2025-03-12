import { DURATION } from "../const";

const filterAddressesByDate = (addresses, duration, date) => {
  const today = new Date(date);
  const prevDay = new Date(new Date(date).setDate(today.getDate() - duration));
  prevDay.setHours(0, 0, 0);

  return [
    ...addresses
      .map((address) => {
        return {
          ...address,
          applications: [...address.applications].filter(
            (item) => {
              return new Date(item.timestamp) <= today &&
                new Date(item.timestamp) >= prevDay
            }
          ),
        };
      })
      .filter((address) => address.applications.length)
      .sort(
        (prev, next) => next.applications.length - prev.applications.length,
      ),
  ];
};

export const groupAddressesByDuration = (duration, addresses, date) => {
  switch (duration) {
    case DURATION.DAY:
    case DURATION.WEEK:
      return filterAddressesByDate(addresses, duration, date);
    case DURATION.MONTH:
      return [
        ...addresses.sort(
          (prev, next) => next.applications.length - prev.applications.length,
        ),
      ];
  }
};
