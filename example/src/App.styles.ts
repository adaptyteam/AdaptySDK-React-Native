import { StyleSheet, PlatformColor } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
  },
  responseContainer: {
    height: 200,
    marginHorizontal: 24,
    marginBottom: 12,
  },
  responseCode: {
    // color: PlatformColor('systemGray2'),
  },
  responseError: {
    // color: PlatformColor('systemRed'),
  },
  titleContainer: {
    marginTop: 24,
    marginHorizontal: 24,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '600',
    flex: 1,
  },
  titleSubText: {
    fontSize: 18,
    lineHeight: 24,
    marginHorizontal: 24,
    marginBottom: 8,
    fontWeight: '500',
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  sessionContainer: {
    marginHorizontal: 24,
    marginBottom: 32,

    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sessionUserText: {
    // color: PlatformColor('secondaryLabel'),
    flex: 1,
  },
  exampleElementContainer: {
    marginHorizontal: 24,
    paddingBottom: 32,
  },
  inputContainer: {
    position: 'relative',
    marginTop: 24,
    flexDirection: 'row',
  },
  inputWrapper: {
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    flex: 1,
    paddingHorizontal: 12,
  },
  inputTitleText: {
    position: 'absolute',
    left: 8,
    top: -9,
    zIndex: 2,
    backgroundColor: 'white',
    paddingHorizontal: 4,
    width: 62,
  },
  codeText: {
    // color: PlatformColor('systemIndigo'),
    fontWeight: '500',
  },
});
