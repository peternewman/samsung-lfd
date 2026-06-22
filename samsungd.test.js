// Import the necessary modules and classes
const { PassThrough } = require('stream')

// Define the test suite for SamsungD
describe('SamsungD', () => {
	let instance

	const SamsungD = require('./samsungd');

	beforeEach(() => {
		var tunnel = new PassThrough()
		instance = new SamsungD({ stream: tunnel }, { disconnect: true })
		instance.emitter.emit = jest.fn()
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	describe('encode', () => {
		test('should handle setting input request', () => {
			expect(instance.encode('input HDMI1')).toMatchObject({
				"encoded": Buffer.from('aa1400012136', 'hex'),
				"name": "SamsungLFD",
			})
		})

		test('should handle setting volume request', () => {
			expect(instance.encode('volume 50')).toMatchObject({
				"encoded": Buffer.from('aa1200013245', 'hex'),
				"name": "SamsungLFD",
			})
		})

		test('should handle getting status request', () => {
			expect(instance.encode('status?')).toMatchObject({
				"encoded": Buffer.from('aa00000000', 'hex'),
				"name": "SamsungLFD",
			})
		})
	})

	describe('decode', () => {
		describe('valid data with NACK', () => {
			afterEach(() => {
				expect(instance.emitter.emit).toHaveBeenCalled()
			})

			const testPModeResponse = {
				"name": "SamsungLFD",
				"status": "ERR",
				"req": "pMode",
			}

			test('should handle pMode NACK response', () => {
				expect(instance.decode(Buffer.from('aaff00034e7101c2', 'hex'))).toMatchObject(testPModeResponse)
			})
		})
	})
})
