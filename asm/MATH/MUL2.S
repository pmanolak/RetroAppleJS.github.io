;
; mul
; Wicked fast LUT-based multiplication
; input: a = factor a; x = factor b
; output: S0.TA = factor a; S0.TX = x = factor x
;         S0.TY = low byte of product a*b
;         S0.TZ = high byte of product a*b
; preserved: x, y
; max cycles: under 90
;
*=$6000
M.PRBYTE  = $FDDA   ; print hex byte
M.CRDO    = $DAFB   ; line feed
M.OUTSP   = $DB57   ; Space
M.COUT    = $FDED   ; print char
M.KPRESS  = $FD35
M.RDKEY   = $FD2F   ; $FD0C
M.STROUT  = $DB3A   ; Print string pointed to by Y,A. The string must end with a zero or a quote.

S2.TX        = $06     ; ONLY USE IN FUNCTIONS with 1 SUB level
S2.TY        = $07     ; ONLY USE IN FUNCTIONS with 1 SUB level

S1.TX        = $08     ; ONLY USE IN FUNCTIONS with 1 SUB level
S1.TY        = $09     ; ONLY USE IN FUNCTIONS with 1 SUB level

S0.TA        = $18       ; mul_factor_a
S0.TX        = $19       ; mul_factor_x
S0.TY        = $1A       ; mul_product_lo
S0.TZ        = $1B       ; mul_product_hi

*=$6000

START   LDA #$00
        JSR ISTROUT     ; Print string from A = index
        JSR M.CRDO

        LDX #$00
        LDY #$00

L2      STY *S2.TY      ; Y-coordinate
L1      STX *S2.TX      ; X-coordinate

        LDA #$D8
        JSR M.COUT
        LDA *S2.TX
        JSR M.PRBYTE    ; PRINT X
        JSR M.OUTSP

        LDA #$D9
        JSR M.COUT
        LDA *S2.TY
        JSR M.PRBYTE    ; PRINT Y
        JSR M.OUTSP

        LDA *S2.TX
        STA *S0.TX
        LDA *S2.TY
        STA *S0.TY
        JSR MUL

        LDA #$BD
        JSR M.COUT      ; PRINT =
        LDA *S0.TX
        JSR M.PRBYTE    ; PRINT RESULT
        LDA *S0.TY
        JSR M.PRBYTE    ; PRINT RESULT

        JSR M.CRDO
        JSR M.KPRESS
        CMP #$8D
        BNE L3
        RTS

L3      LDX *S2.TX
        INX
        ;CPX #$BF
        CPX #$10
        BNE L1
        LDX #$00      ; RESET VALUE
        STX *S2.TX
        LDY *S2.TY
        INY
        ;CPY #$BF
        CPY #$00
        BNE L2
        RTS



; *** PRINT STRING from Y = INDEX ***
STR.00  ASC "(RETURN=EXIT)"    ;0
        HEX 00

ISTROUT LDY #<STR.00    ; init pointer
        STY *S0.TX
        LDY #>STR.00    ; init pointer
        STY *S0.TY
        LDY #$00
        TAX             ; X = array index
        BEQ IST.2
        DEY
IST.1   INY
        LDA (S0.TX),Y
        BNE IST.1
        DEX
        BNE IST.1
        INY             ; Y = found starting index
IST.2   LDA (S0.TX),Y   ; Print string until next zero
        BEQ IST.3
        JSR M.COUT
        INY
        BNE IST.2
IST.3   RTS



; mul 8x8 16 bit result for when you can't afford big tables
; by djmips
;
; inputs are S0.TY and S0.TX and should be zero page.
; A should be zero entering but if you want it will factor in as 1/2 A added to the result.
;
; output is 16 bit in S0.TY & S0.TX   (S0.TX is high byte)
;
; length = 65 bytes
; total cycles worst case = 113
; total cycles best case = 97
; avg = 105
; inner loop credits supercat

MUL  LDA *S0.TX
     BEQ b9
     LDA #$00
     DEC *S0.TX
     ROR *S0.TY
     BCC b1
     ADC *S0.TX
b1   ROR A
     ROR *S0.TY
     BCC b2
     ADC *S0.TX
b2   ROR A
     ROR *S0.TY
     BCC b3
     ADC *S0.TX
b3   ROR A
     ROR *S0.TY
     BCC b4
     ADC *S0.TX
b4   ROR A
     ROR *S0.TY
     BCC b5
     ADC *S0.TX
b5   ROR A
     ROR *S0.TY
     BCC b6
     ADC *S0.TX
b6   ROR A
     ROR *S0.TY
     BCC b7
     ADC *S0.TX
b7   ROR A
     ROR *S0.TY
     BCC b8
     ADC *S0.TX
b8   ROR A
     ROR *S0.TY
     INC *S0.TX
     STA *S0.TX
     RTS
b9   LDA #$00
     STA *S0.TY
     RTS
