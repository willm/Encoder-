describe("Encoder", function() {
	var encoder = new Encoder();

	it("should have an encode function", function() {
		expect(typeof encoder.encode).toBe("function");
	});
	
	it("encode should throw if input file is not a wav", function() {
		var expectedError = {name:'InvalidFileError',message:'Please encode a flac file'};
		expect(function(){encoder.encode("afile.kkk")}).toThrow(expectedError);
	});
	
	it("should encode the file to wav", function() {
		var fakeNExpect = {
							spawn:function () {
												return{expect:function () {},
														run:function () {}}
											}
							};

		spyOn(fakeNExpect, 'spawn');
		var nexpect = fakeNExpect;
		
		encoder.encode('spec/res/test.flac');
		
		expect(fakeNExpect.spawn).toHaveBeenCalled();
	});
});

