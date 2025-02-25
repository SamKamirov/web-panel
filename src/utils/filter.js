import { DURATION } from "../const";

const filterAddressesByDate = (addresses, duration) => {
  const today = new Date();
  const prevDay = new Date(new Date().setDate(today.getDate() - duration));
  prevDay.setHours(0, 0, 0);

  return [
    ...addresses
      .map((address) => {
        return {
          ...address,
          applications: [...address.applications].filter(
            (item) =>
              new Date(item.timestamp) <= today &&
              new Date(item.timestamp) >= prevDay,
          ),
        };
      })
      .filter((address) => address.applications.length)
      .sort(
        (prev, next) => next.applications.length - prev.applications.length,
      ),
  ];
};

export const groupAddressesByDuration = (duration, addresses) => {
  switch (duration) {
    case DURATION.DAY:
    case DURATION.WEEK:
      return filterAddressesByDate(addresses, duration);
    case DURATION.MONTH:
      return [
        ...addresses.sort(
          (prev, next) => next.applications.length - prev.applications.length,
        ),
      ];
  }
};
